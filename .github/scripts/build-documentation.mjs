import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { categories, modules, site } from "../../documentation/catalog.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(scriptDirectory, "../..");
const outputDirectory = path.join(rootDirectory, ".pages");
const assetDirectory = path.join(rootDirectory, "documentation/assets");

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const normalize = (value) =>
  value
    .toLocaleLowerCase("de")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
const moduleBySlug = new Map(modules.map((module) => [module.slug, module]));

const maturityLabels = {
  stable: "solider Kern",
  partial: "teilweise",
  prototype: "Prototyp",
  stub: "Skizze",
};

const renderSearch = (root) => `
  <div class="search-wrap" data-search-wrap data-root="${root}">
    <label class="sr-only" for="global-search">Module durchsuchen</label>
    <input id="global-search" class="search-input" data-search type="search" autocomplete="off" placeholder="Modul, Konzept oder API suchen …">
    <div class="search-results" data-search-results role="status" aria-live="polite" aria-atomic="true" hidden></div>
  </div>`;

const renderNavigation = (root, active) => {
  const categorySections = categories
    .map((category) => {
      const links = modules
        .filter((module) => module.category === category.slug)
        .map(
          (module) => `
            <li><a${active === module.slug ? ' class="active" aria-current="page"' : ""} href="${root}modules/${module.slug}/">${escapeHtml(module.title)}</a></li>`,
        )
        .join("");
      return `
        <section class="nav-section" aria-labelledby="nav-${category.slug}">
          <h2 class="nav-section-title" id="nav-${category.slug}">${escapeHtml(category.title)}</h2>
          <ul class="nav-list">${links}</ul>
        </section>`;
    })
    .join("");

  return `
    <aside class="sidebar" id="docs-navigation" aria-label="Dokumentationsnavigation">
      <div class="sidebar-head">
        <strong>Navigation</strong>
        <button class="icon-button" type="button" data-nav-close aria-label="Navigation schließen">×</button>
      </div>
      <section class="nav-section">
        <h2 class="nav-section-title">Start</h2>
        <ul class="nav-list">
          <li><a${active === "home" ? ' class="active" aria-current="page"' : ""} href="${root}">Überblick</a></li>
          <li><a${active === "modules" ? ' class="active" aria-current="page"' : ""} href="${root}modules/">Alle Module</a></li>
          <li><a${active === "guide" ? ' class="active" aria-current="page"' : ""} href="${root}guide/">Build-it-yourself-Methode</a></li>
        </ul>
      </section>
      ${categorySections}
    </aside>`;
};

const renderPage = ({
  title,
  description,
  root,
  active,
  canonicalPath,
  body,
  bodyClass = "",
}) => {
  const canonical = new URL(canonicalPath, site.productionUrl).href;
  return `<!doctype html>
<html lang="de" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark light">
  <meta name="theme-color" content="#07100f">
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="ts-libs — Build it yourself">
  <link rel="canonical" href="${canonical}">
  <link rel="stylesheet" href="${root}assets/styles.css">
  <script>try{document.documentElement.dataset.theme=localStorage.getItem("ts-libs-docs-theme")||"dark"}catch{}</script>
  <script defer src="${root}assets/search-index.js"></script>
  <script defer src="${root}assets/app.js"></script>
  <title>${escapeHtml(title)} · ts-libs</title>
</head>
<body class="${bodyClass}">
  <a class="skip-link" href="#main-content">Zum Inhalt springen</a>
  <div class="reading-progress" data-reading-progress aria-hidden="true"></div>
  <div class="shell" data-shell>
    <header class="topbar">
      <div class="top-actions">
        <button class="icon-button" type="button" data-nav-toggle aria-controls="docs-navigation" aria-expanded="false" aria-label="Navigation öffnen">☰</button>
        <a class="brand" href="${root}" aria-label="ts-libs Dokumentation – Startseite">
          <span class="brand-mark" aria-hidden="true">&lt;/&gt;</span>
          <strong>ts-libs</strong><span>/ build-it-yourself</span>
        </a>
      </div>
      ${renderSearch(root)}
      <div class="top-actions">
        <a class="small-button" href="${site.repository}">GitHub</a>
        <button class="small-button" type="button" data-theme-toggle><span data-theme-label>Light</span> theme</button>
      </div>
    </header>
    <div class="layout">
      ${renderNavigation(root, active)}
      <div class="overlay" data-overlay aria-hidden="true"></div>
      <main class="main" id="main-content">${body}</main>
    </div>
    <footer class="footer">
      <span>Konzeptdokumentation – kein Installations- oder API-Handbuch.</span>
      <span>Aus dem Quellcode abgeleitet · MIT · ${new Date().getUTCFullYear()}</span>
    </footer>
  </div>
</body>
</html>`;
};

const renderModuleCard = (module, index, root = "./") => {
  const category = categoryBySlug.get(module.category);
  const searchable = [
    module.title,
    module.packageName,
    module.summary,
    ...(module.tags || []),
    ...(module.api || []).map((entry) => entry.name),
  ].join(" ");
  return `
    <article class="module-card" data-module-card data-category="${module.category}" data-search="${escapeHtml(searchable)}">
      <div class="card-top">
        <span class="index-no">${String(index + 1).padStart(2, "0")}</span>
        <span class="status ${module.maturity}">${maturityLabels[module.maturity]}</span>
      </div>
      <h3>${escapeHtml(module.title)}</h3>
      <p>${escapeHtml(module.summary)}</p>
      <div class="module-meta"><span class="tag">${escapeHtml(category?.title || module.category)}</span></div>
      <a class="card-link" href="${root}modules/${module.slug}/" aria-label="${escapeHtml(module.title)} verstehen">Modul zerlegen</a>
    </article>`;
};

const renderHome = () => {
  const maturityCount = new Set(modules.map((module) => module.maturity)).size;
  const featured = modules.filter((module) => module.featured).slice(0, 6);
  const displayed = featured.length >= 6 ? featured : modules.slice(0, 6);
  const cards = displayed.map((module, index) => renderModuleCard(module, index)).join("");

  const body = `
    <div class="content">
      <section class="hero">
        <div>
          <p class="eyebrow">TypeScript-Systeme · auseinandergenommen</p>
          <h1>Nicht benutzen. Verstehen.</h1>
          <p class="lead">35 Module als technische Baupläne: Problem, Kontrollfluss, Kompromisse und eine kleine Eigenimplementierung. Ohne Marketing, ohne magische Abstraktion.</p>
          <div class="button-row">
            <a class="button primary" href="modules/">Module erkunden</a>
            <a class="button" href="guide/">Die Methode lernen</a>
          </div>
        </div>
        <div class="hero-code" aria-label="Dokumentationsprinzip">
          <p class="token-comment">// jedes Modul beantwortet:</p>
          <p><span class="token-key">problem</span>: <span class="token-value">warum existiert es?</span></p>
          <p><span class="token-key">flow</span>: <span class="token-value">was passiert wann?</span></p>
          <p><span class="token-key">invariants</span>: <span class="token-value">was muss gelten?</span></p>
          <p><span class="token-key">build</span>: <span class="token-value">wie baue ich es selbst?</span></p>
          <p><span class="token-key">limits</span>: <span class="token-value">wo bricht es?</span></p>
        </div>
      </section>

      <div class="stat-grid" aria-label="Umfang der Dokumentation">
        <div class="stat"><strong>${modules.length}</strong><span>Module aus dem Monorepo</span></div>
        <div class="stat"><strong>${categories.length}</strong><span>technische Themengebiete</span></div>
        <div class="stat"><strong>${maturityCount}</strong><span>ehrliche Reifegrad-Stufen</span></div>
        <div class="stat"><strong>0</strong><span>Runtime-Abhängigkeiten der Seite</span></div>
      </div>

      <section class="section" aria-labelledby="featured-heading">
        <div class="section-head">
          <div><p class="eyebrow">Einstiegspunkte</p><h2 id="featured-heading">Sechs gute Systeme zum Zerlegen</h2></div>
          <p>Beginne bei einem bekannten Problem. Jede Seite trennt die Idee bewusst von der konkreten Bibliothek.</p>
        </div>
        <div class="module-grid">${cards}</div>
      </section>

      <section class="section" aria-labelledby="paths-heading">
        <div class="section-head">
          <div><p class="eyebrow">Lernpfade</p><h2 id="paths-heading">Vom Datentyp zum System</h2></div>
          <p>Die Module ergeben mehr Sinn, wenn du sie als aufeinander aufbauende Konzepte liest.</p>
        </div>
        <div class="path-grid">
          <article class="path-card"><span class="step">PATH 01</span><h3>Daten sicher formen</h3><p>Assertions → Collections → Fehlernormalisierung → binäre Formate.</p></article>
          <article class="path-card"><span class="step">PATH 02</span><h3>Kontrollfluss beherrschen</h3><p>Observables → State Store → State Machine → Tasks, Queues und Worker.</p></article>
          <article class="path-card"><span class="step">PATH 03</span><h3>Grenzen überschreiten</h3><p>Parser → Signaturen → Peer Discovery → verteilte Koordination.</p></article>
        </div>
      </section>
    </div>`;

  return renderPage({
    title: "TypeScript-Systeme verstehen und selbst bauen",
    description: site.description,
    root: "./",
    active: "home",
    canonicalPath: "",
    body,
  });
};

const renderDirectory = () => {
  const cards = modules.map((module, index) => renderModuleCard(module, index, "../")).join("");
  const filters = [
    '<button class="filter-button active" type="button" data-category-filter="all" aria-pressed="true">Alle</button>',
    ...categories.map(
      (category) =>
        `<button class="filter-button" type="button" data-category-filter="${category.slug}" aria-pressed="false">${escapeHtml(category.title)}</button>`,
    ),
  ].join("");
  const body = `
    <div class="content">
      <p class="eyebrow">Modulkatalog</p>
      <h1>35 Ideen. Kein Blackbox-Code.</h1>
      <p class="lead">Suche nach einem Problem, einer API oder einem Konzept. Reifegrade beschreiben den vorhandenen Repository-Stand – nicht die grundsätzliche Qualität der Idee.</p>
      <div class="directory-tools">
        <label for="module-filter">Module in dieser Ansicht filtern</label>
        <input class="search-input" id="module-filter" data-module-filter type="search" placeholder="z. B. Queue, Signatur, Parser …">
        <div class="filter-row" aria-label="Nach Themengebiet filtern">${filters}</div>
        <span class="result-count" data-result-count role="status" aria-live="polite">${modules.length} Module</span>
      </div>
      <div class="module-grid">${cards}</div>
    </div>`;
  return renderPage({
    title: "Alle Module",
    description: "Alle ts-libs-Module nach Konzept, Kontrollfluss und Eigenimplementierung durchsuchen.",
    root: "../",
    active: "modules",
    canonicalPath: "modules/",
    body,
  });
};

const renderList = (items, className = "plain-list") =>
  `<ul class="${className}">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;

const renderModule = (module) => {
  const category = categoryBySlug.get(module.category);
  const api = module.api
    .map(
      (entry) => `
        <div class="api-item">
          <code>${escapeHtml(entry.name)}</code>
          <span>${escapeHtml(entry.description)}</span>
        </div>`,
    )
    .join("");
  const related = (module.related || [])
    .map((slug) => moduleBySlug.get(slug))
    .filter(Boolean)
    .map((entry) => `<a class="related-link" href="../${entry.slug}/">${escapeHtml(entry.title)} →</a>`)
    .join("");
  const tags = module.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
  const body = `
    <div class="content narrow">
      <header class="module-header">
        <p class="breadcrumb"><a href="../../modules/">Module</a> / ${escapeHtml(category?.title || module.category)}</p>
        <div class="status-row"><span class="status ${module.maturity}">${maturityLabels[module.maturity]}</span><span class="index-no">${escapeHtml(module.source)}</span></div>
        <h1>${escapeHtml(module.title)}</h1>
        <p class="package-name">${escapeHtml(module.packageName)}</p>
        <p class="lead">${escapeHtml(module.summary)}</p>
        <div class="filter-row">${tags}</div>
      </header>
      <div class="article-layout">
        <article class="article">
          <section id="problem"><p class="eyebrow">01 · Problem</p><h2>Wofür braucht man das?</h2><p>${escapeHtml(module.problem)}</p></section>
          <section id="model"><p class="eyebrow">02 · Denkmodell</p><h2>Das mentale Modell</h2><p>${escapeHtml(module.mentalModel)}</p><div class="callout"><strong>Im Repository</strong><p>${escapeHtml(module.repositoryImplementation)}</p></div></section>
          <section id="flow"><p class="eyebrow">03 · Kontrollfluss</p><h2>Was passiert in welcher Reihenfolge?</h2><ol class="flow-list">${module.flow.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol></section>
          <section id="surface"><p class="eyebrow">04 · Bauteile</p><h2>Die entscheidenden Verträge</h2><div class="api-list">${api}</div></section>
          <section id="build"><p class="eyebrow">05 · Build it yourself</p><h2>Selbst implementieren</h2><p>${escapeHtml(module.build.intro)}</p><ol class="recipe-list">${module.build.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol><div class="code-block"><div class="code-head"><span>minimal.ts · unabhängig vom Package</span><button class="copy-button" type="button" data-copy>Code kopieren</button></div><pre><code>${escapeHtml(module.build.code)}</code></pre></div></section>
          <section id="verify"><p class="eyebrow">06 · Verifizieren</p><h2>Was du testen solltest</h2>${renderList(module.tests)}</section>
          <section id="limits"><p class="eyebrow">07 · Grenzen</p><h2>Kompromisse und Stolperfallen</h2>${renderList(module.tradeoffs)}${module.note ? `<div class="callout"><strong>Wichtig</strong><p>${escapeHtml(module.note)}</p></div>` : ""}</section>
          <section id="source"><p class="eyebrow">08 · Weiterdenken</p><h2>Quellcode und Nachbarn</h2><p><a class="button" href="${site.repository}/tree/main/${module.source}">Originalcode auf GitHub ansehen</a></p>${related ? `<div class="related-grid">${related}</div>` : ""}</section>
        </article>
        <nav class="toc" aria-label="Auf dieser Seite"><strong>Auf dieser Seite</strong><a href="#problem">Problem</a><a href="#model">Denkmodell</a><a href="#flow">Kontrollfluss</a><a href="#surface">Bauteile</a><a href="#build">Selbst implementieren</a><a href="#verify">Tests</a><a href="#limits">Grenzen</a><a href="#source">Quellcode</a></nav>
      </div>
    </div>`;
  return renderPage({
    title: `${module.title} verstehen`,
    description: module.summary,
    root: "../../",
    active: module.slug,
    canonicalPath: `modules/${module.slug}/`,
    body,
    bodyClass: "module-page",
  });
};

const renderGuide = () => {
  const principles = [
    ["Vertrag zuerst", "Definiere Eingaben, Ausgaben, Fehler und Invarianten, bevor du eine Klasse baust."],
    ["Kleinster korrekter Kern", "Implementiere zuerst nur den glücklichen Pfad und genau eine explizite Fehlersemantik."],
    ["Zustand sichtbar machen", "Halte Ownership und Übergänge nachvollziehbar. Versteckter Zustand ist die häufigste Systemfalle."],
    ["Grenzen erzwingen", "Timeouts, Größenlimits, Abbruchsignale und idempotente Operationen gehören zum Vertrag."],
    ["Eigenschaften testen", "Teste nicht nur Beispiele, sondern Invarianten wie Reihenfolge, Determinismus und Roundtrips."],
    ["Erst dann abstrahieren", "Verallgemeinere erst, wenn zwei konkrete Implementierungen denselben Druck erzeugen."],
  ];
  const body = `
    <div class="content narrow">
      <p class="eyebrow">Build-it-yourself-Methode</p>
      <h1>Von fremdem Code zum eigenen System.</h1>
      <p class="lead">Die Modulseiten sind keine Copy-and-paste-Anleitung. Sie zeigen eine wiederholbare Methode, mit der du eine Idee zerlegst, prüfst und in einer für dein System passenden Form neu baust.</p>
      <section class="section"><h2>Sechs Regeln</h2><div class="principle-grid">${principles.map(([title, text]) => `<article class="principle-card"><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></section>
      <section class="section"><p class="eyebrow">Ablauf</p><h2>Eine Implementierung in sieben Schritten</h2><ol class="recipe-list"><li>Schreibe das Problem in einem Satz ohne den Namen der bestehenden Library.</li><li>Liste Daten, Zustände und externe Effekte getrennt auf.</li><li>Formuliere drei Invarianten, die nach jeder Operation gelten müssen.</li><li>Baue einen synchronen, lokalen Kern ohne Optimierung.</li><li>Teste Happy Path, Grenzfall und gezielten Fehler.</li><li>Füge Async, Persistenz oder Netzwerk erst an klaren Ports hinzu.</li><li>Miss, ob die zusätzliche Abstraktion den Betrieb wirklich verbessert.</li></ol></section>
      <section class="section"><p class="eyebrow">Review-Checkliste</p><h2>Bevor der Code „fertig“ ist</h2>${renderList(["Ist klar, wem veränderlicher Zustand gehört?", "Sind Fehler typisiert oder mindestens normalisiert?", "Kann eine Operation sicher wiederholt oder abgebrochen werden?", "Gibt es harte Limits für unkontrollierte Eingaben?", "Sind Zeit, Zufall, I/O und Netzwerk im Test austauschbar?", "Dokumentiert der Name das Konzept statt die aktuelle Implementierung?"])}</section>
    </div>`;
  return renderPage({
    title: "Build-it-yourself-Methode",
    description: "Eine wiederholbare Methode, um TypeScript-Systeme aus Verträgen, Invarianten und kleinen testbaren Kernen selbst zu implementieren.",
    root: "../",
    active: "guide",
    canonicalPath: "guide/",
    body,
  });
};

const writePage = async (relativePath, content) => {
  const target = path.join(outputDirectory, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
};

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(path.join(outputDirectory, "assets"), { recursive: true });
await cp(assetDirectory, path.join(outputDirectory, "assets"), { recursive: true });

const searchIndex = modules.map((module) => ({
  slug: module.slug,
  title: module.title,
  summary: module.summary,
  searchable: normalize(
    [
      module.title,
      module.packageName,
      module.summary,
      module.problem,
      ...module.tags,
      ...module.api.map((entry) => `${entry.name} ${entry.description}`),
    ].join(" "),
  ),
}));
await writePage(
  "assets/search-index.js",
  `window.__TS_LIBS_SEARCH__ = ${JSON.stringify(searchIndex).replaceAll("<", "\\u003c")};\n`,
);
await writePage("index.html", renderHome());
await writePage("modules/index.html", renderDirectory());
await writePage("guide/index.html", renderGuide());
await Promise.all(
  modules.map((module) => writePage(`modules/${module.slug}/index.html`, renderModule(module))),
);

const pageUrls = ["", "modules/", "guide/", ...modules.map((module) => `modules/${module.slug}/`)];
await writePage(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pageUrls
    .map((url) => `  <url><loc>${new URL(url, site.productionUrl).href}</loc></url>`)
    .join("\n")}\n</urlset>\n`,
);
await writePage(
  "robots.txt",
  `User-agent: *\nAllow: /\nSitemap: ${new URL("sitemap.xml", site.productionUrl).href}\n`,
);
await writePage(".nojekyll", "");
await writePage(
  "404.html",
  `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Nicht gefunden · ts-libs</title><style>body{margin:0;display:grid;place-items:center;min-height:100vh;background:#07100f;color:#edf7f1;font:16px system-ui}main{max-width:34rem;padding:2rem}a{color:#71f6b5}</style><main><p>404 / route_not_found</p><h1>Diese Dokumentationsseite existiert nicht.</h1><p><a href="${site.productionUrl}">Zur Modulübersicht →</a></p></main></html>`,
);

console.log(`Built ${modules.length + 3} documentation pages in ${path.relative(rootDirectory, outputDirectory)}/`);
