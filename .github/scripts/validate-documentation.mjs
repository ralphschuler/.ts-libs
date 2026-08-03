import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { categories, modules } from "../../documentation/catalog.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
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

if (modules.length !== 35) errors.push(`Expected 35 modules, found ${modules.length}.`);
for (const module of modules) {
  for (const field of requiredFields) {
    if (module[field] == null || module[field] === "") {
      errors.push(`${module.slug || "unknown"}: missing ${field}.`);
    }
  }
  if (slugs.has(module.slug)) errors.push(`Duplicate module slug: ${module.slug}.`);
  slugs.add(module.slug);
  if (!categorySlugs.has(module.category)) errors.push(`${module.slug}: unknown category.`);
  if (!["stable", "partial", "prototype", "stub"].includes(module.maturity)) {
    errors.push(`${module.slug}: invalid maturity ${module.maturity}.`);
  }
  if (!Array.isArray(module.flow) || module.flow.length < 3) errors.push(`${module.slug}: flow needs at least 3 steps.`);
  if (!Array.isArray(module.api) || module.api.length < 1) errors.push(`${module.slug}: API surface is empty.`);
  if (!module.build?.code?.trim() || !Array.isArray(module.build.steps) || module.build.steps.length < 3) {
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
    errors.push(`${module.slug}: source path does not exist (${module.source}).`);
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
    errors.push(`${path.relative(output, htmlFile)}: root-relative link breaks project Pages: ${clean}`);
    return null;
  }
  const target = path.resolve(path.dirname(htmlFile), clean);
  return clean.endsWith("/") ? path.join(target, "index.html") : target;
};

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, "utf8");
  const relative = path.relative(output, htmlFile);
  if ((html.match(/<h1[ >]/g) || []).length !== 1) errors.push(`${relative}: expected exactly one h1.`);
  if (relative.startsWith("modules/") && relative !== "modules/index.html" && !html.includes("Selbst implementieren")) {
    errors.push(`${relative}: missing self-implementation section.`);
  }
  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const reference of references) {
    const target = resolveLocalTarget(htmlFile, reference);
    if (!target) continue;
    try {
      await access(target);
    } catch {
      errors.push(`${relative}: broken local reference ${reference}.`);
    }
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML files and ${modules.length} module records.`);
