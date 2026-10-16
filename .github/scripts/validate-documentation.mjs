import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { categories, modules, site } from "../../documentation/catalog.mjs";
import { modules as englishModules } from "../../documentation/catalog.en.mjs";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const output = path.join(root, ".pages");
const errors = [];
const requiredFields = [
  "slug",
  "title",
  "packageName",
  "category",
  "summary",
  "maturity",
  "tags",
  "problem",
  "mentalModel",
  "repositoryImplementation",
  "flow",
  "api",
  "build",
  "tests",
  "tradeoffs",
  "source",
];
const categorySlugs = new Set(categories.map((category) => category.slug));
const slugs = new Set();
if (englishModules.length !== modules.length)
  errors.push("Language editions have different module counts.");
for (const translated of englishModules) {
  const original = modules.find((module) => module.slug === translated.slug);
  if (!original) {
    errors.push(`Unknown English module ${translated.slug}.`);
    continue;
  }
  for (const field of [
    "summary",
    "problem",
    "mentalModel",
    "repositoryImplementation",
  ]) {
    if (!translated[field]?.trim() || translated[field] === original[field])
      errors.push(`${translated.slug}: missing English ${field}.`);
  }
  if (translated.api.length !== original.api.length)
    errors.push(`${translated.slug}: API translation incomplete.`);
}

if (modules.length !== 35)
  errors.push(`Expected 35 modules, found ${modules.length}.`);
for (const module of modules) {
  for (const field of requiredFields) {
    if (module[field] == null || module[field] === "") {
      errors.push(`${module.slug || "unknown"}: missing ${field}.`);
    }
  }
  if (slugs.has(module.slug))
    errors.push(`Duplicate module slug: ${module.slug}.`);
  slugs.add(module.slug);
  if (!categorySlugs.has(module.category))
    errors.push(`${module.slug}: unknown category.`);
  if (!["stable", "partial", "prototype", "stub"].includes(module.maturity)) {
    errors.push(`${module.slug}: invalid maturity ${module.maturity}.`);
  }
  if (!Array.isArray(module.flow) || module.flow.length < 3)
    errors.push(`${module.slug}: flow needs at least 3 steps.`);
  if (!Array.isArray(module.api) || module.api.length < 1)
    errors.push(`${module.slug}: API surface is empty.`);
  if (
    !module.build?.code?.trim() ||
    !Array.isArray(module.build.steps) ||
    module.build.steps.length < 3
  ) {
    errors.push(`${module.slug}: incomplete build-it-yourself recipe.`);
  }
  for (const related of module.related || []) {
    if (!modules.some((candidate) => candidate.slug === related)) {
      errors.push(`${module.slug}: unknown related module ${related}.`);
    }
  }
  try {
    await access(path.join(root, module.source));
  } catch {
    errors.push(
      `${module.slug}: source path does not exist (${module.source}).`,
    );
  }
}

const htmlFiles = [];
const walk = async (directory) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(fullPath);
    else if (entry.name.endsWith(".html")) htmlFiles.push(fullPath);
  }
};

try {
  await walk(output);
} catch (error) {
  errors.push(`Build output missing: ${error.message}`);
}

const resolveLocalTarget = (htmlFile, reference) => {
  const clean = reference.split("#")[0].split("?")[0];
  if (!clean || /^(https?:|mailto:|tel:)/.test(clean)) return null;
  if (clean.startsWith("/")) {
    errors.push(
      `${path.relative(output, htmlFile)}: root-relative link breaks project Pages: ${clean}`,
    );
    return null;
  }
  const target = path.resolve(path.dirname(htmlFile), clean);
  return clean.endsWith("/") ? path.join(target, "index.html") : target;
};

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, "utf8");
  const relative = path.relative(output, htmlFile);
  if ((html.match(/<h1[ >]/g) || []).length !== 1)
    errors.push(`${relative}: expected exactly one h1.`);
  const locale = relative.split(path.sep)[0];
  const localized = ["en", "de"].includes(locale);
  if (localized && !html.includes(`<html lang="${locale}"`))
    errors.push(`${relative}: incorrect document language.`);
  if (
    /^(en|de)\/modules\/[^/]+\/index\.html$/.test(relative) &&
    !html.includes('id="build"')
  ) {
    errors.push(`${relative}: missing self-implementation section.`);
  }
  if (localized) {
    const route = relative.replace(/index\.html$/, "");
    const canonical = new URL(route, site.productionUrl).href;
    if (!html.includes(`<link rel="canonical" href="${canonical}">`))
      errors.push(`${relative}: incorrect canonical URL.`);
    for (const code of ["en", "de", "x-default"]) {
      if (!html.includes(`hreflang="${code}"`))
        errors.push(`${relative}: missing ${code} alternate.`);
    }
    if (!html.includes('class="small-button language-switch"'))
      errors.push(`${relative}: missing language switch.`);
    if (!html.includes('class="skip-link"'))
      errors.push(`${relative}: missing skip link.`);
  }
  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(
    (match) => match[1],
  );
  for (const reference of references) {
    const target = resolveLocalTarget(htmlFile, reference);
    if (!target) continue;
    try {
      await access(target);
      const fragment = reference.split("#")[1];
      if (fragment && target.endsWith(".html")) {
        const destination = await readFile(target, "utf8");
        if (!destination.includes(`id="${fragment}"`))
          errors.push(`${relative}: missing fragment ${reference}.`);
      }
    } catch {
      errors.push(`${relative}: broken local reference ${reference}.`);
    }
  }
}

const expectedPages = (modules.length + 3) * 3 + 1;
if (htmlFiles.length !== expectedPages)
  errors.push(
    `Expected ${expectedPages} pages including redirects and 404, found ${htmlFiles.length}.`,
  );
const sitemap = await readFile(path.join(output, "sitemap.xml"), "utf8");
for (const locale of ["en", "de"]) {
  for (const route of [
    "",
    "modules/",
    "guide/",
    ...modules.map((module) => `modules/${module.slug}/`),
  ]) {
    if (
      !sitemap.includes(
        `<loc>${new URL(`${locale}/${route}`, site.productionUrl).href}</loc>`,
      )
    )
      errors.push(`Sitemap missing ${locale}/${route}.`);
  }
}
if (!sitemap.includes('hreflang="x-default"'))
  errors.push("Sitemap is missing default language alternates.");
const robots = await readFile(path.join(output, "robots.txt"), "utf8");
if (!robots.includes(new URL("sitemap.xml", site.productionUrl).href))
  errors.push("robots.txt uses the wrong sitemap URL.");

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(
  `Validated ${htmlFiles.length} HTML files and ${modules.length} module records.`,
);
