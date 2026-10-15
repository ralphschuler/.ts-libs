import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  categories as sourceCategories,
  modules as germanModules,
  site,
} from "../../documentation/catalog.mjs";
import { modules as englishModules } from "../../documentation/catalog.en.mjs";
import { localizeCategories, locales } from "../../documentation/locales.mjs";

const rootDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const output = path.join(rootDirectory, ".pages");
const escape = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
const normalize = (value, locale) =>
  value
    .toLocaleLowerCase(locale)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
const absolute = (route) => new URL(route, site.productionUrl).href;
const write = async (route, contents) => {
  const target = path.join(output, route);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, contents);
};

const copy = {
  en: {
    overview: "Overview",
    modules: "All modules",
    guide: "Build-it-yourself method",
    search: "Search modules",
    placeholder: "Search a module, concept, or API …",
    navigation: "Documentation navigation",
    open: "Open navigation",
    close: "Close navigation",
    skip: "Skip to content",
    home: "ts-libs documentation home",
    theme: "Change theme",
    light: "Light theme",
    dark: "Dark theme",
    footer: "Concepts, experiments, and the evidence behind them.",
    derived: "Read the source, build a core, test its limits.",
    maturity: {
      stable: "stable core",
      partial: "partial",
      prototype: "prototype",
      stub: "sketch",
    },
    hero: "Understand the system. Build your own.",
    lead: "35 TypeScript experiments explained through their problems, contracts, control flow, and limits. Start small, test your assumptions, and follow the source.",
    eyebrow: "TypeScript systems · taken apart",
    explore: "Explore the experiments",
    method: "Learn the method",
    scope: "Documentation scope",
    count: "experiments",
    domains: "technical domains",
    editions: "complete language editions",
    dependencies: "site runtime dependencies",
    featured: "Starting points",
    featuredTitle: "Six systems worth taking apart",
    featuredLead:
      "Choose a familiar problem. Read the idea, inspect the experiment, then build an independent core.",
    paths: "Learning paths",
    pathsTitle: "Follow concepts that build on each other",
    pathNames: [
      "Shape data safely",
      "Control asynchronous work",
      "Cross system boundaries",
    ],
    maturityTitle: "What does “finished” mean?",
    maturityText:
      "A concept explains an idea. A working experiment demonstrates a tested, documented core. A production package additionally needs compatibility guarantees, operational limits, integration evidence, and maintenance. No badge alone promises production readiness.",
    directoryTitle: "35 ideas to explore",
    directoryLead:
      "Filter by a problem, API, or domain. Every experiment stays visible; maturity describes the implementation and its evidence.",
    filter: "Filter modules",
    all: "All",
    categoryFilter: "Filter by domain",
    result: "modules",
    card: "Read the blueprint",
    understand: "Understand",
    sections: [
      "Problem",
      "Mental model",
      "Control flow",
      "Building blocks",
      "Build it yourself",
      "Verify",
      "Limits",
      "Keep exploring",
    ],
    headings: [
      "What is it for?",
      "How should you think about it?",
      "What happens in which order?",
      "The important contracts",
      "Implement a small core",
      "What should you test?",
      "Trade-offs and failure modes",
      "Source code and related ideas",
    ],
    repository: "In this repository",
    copy: "Copy code",
    code: "Concept sketch · may reference omitted helpers",
    important: "Important",
    source: "View source on GitHub",
    example: "Run the verified example",
    tests: "Inspect the tests",
    toc: "On this page",
    exercise: "Try it yourself",
    exerciseIntro:
      "Turn the first verification claim into a failing test, implement the smallest fix, then add a boundary case.",
    exerciseAnswer: "Compare your approach",
    exerciseHint:
      "Your check should fail when the stated invariant is deliberately broken, and pass again after the fix. Keep setup deterministic and assert an observable result.",
    guideTitle: "Turn unfamiliar code into a system you understand.",
    guideLead:
      "Use one repeatable method: state the contract, build a small core, and test the properties that matter.",
    principles: [
      [
        "Contract first",
        "Define inputs, outputs, errors and invariants before designing classes.",
      ],
      [
        "A small correct core",
        "Implement one useful behavior with one explicit failure policy.",
      ],
      ["Visible state", "Make ownership and state transitions easy to follow."],
      [
        "Explicit boundaries",
        "Put cancellation, size limits and timeouts in the contract.",
      ],
      [
        "Test properties",
        "Check ordering, determinism, resource cleanup and round trips.",
      ],
      [
        "Earn abstractions",
        "Generalize when concrete implementations demonstrate the need.",
      ],
    ],
    checklist: "Before calling an experiment finished",
    checks: [
      "Does its public entry point build?",
      "Does importing it leave the environment alone?",
      "Do real tests cover its documented core and error paths?",
      "Are resources released and input sizes bounded?",
      "Do examples and both language editions match the implementation?",
      "Are unsupported integrations and next steps explicit?",
    ],
    empty: "No module found.",
    copied: "Copied",
    unavailable: "Copy unavailable",
    notFound: "This documentation page does not exist.",
    choose: "Choose a language",
  },
  de: {
    overview: "Überblick",
    modules: "Alle Module",
    guide: "Build-it-yourself-Methode",
    search: "Module durchsuchen",
    placeholder: "Modul, Konzept oder API suchen …",
    navigation: "Dokumentationsnavigation",
    open: "Navigation öffnen",
    close: "Navigation schließen",
    skip: "Zum Inhalt springen",
    home: "ts-libs Dokumentation – Startseite",
    theme: "Darstellung ändern",
    light: "Helles Design",
    dark: "Dunkles Design",
    footer: "Konzepte, Experimente und ihre überprüfbaren Grundlagen.",
    derived: "Quellcode lesen, einen Kern bauen, Grenzen testen.",
    maturity: {
      stable: "solider Kern",
      partial: "teilweise",
      prototype: "Prototyp",
      stub: "Skizze",
    },
    hero: "Systeme verstehen. Selbst bauen.",
    lead: "35 TypeScript-Experimente mit ihren Problemen, Verträgen, Kontrollflüssen und Grenzen. Beginne klein, prüfe deine Annahmen und folge dem Quellcode.",
    eyebrow: "TypeScript-Systeme · auseinandergenommen",
    explore: "Experimente erkunden",
    method: "Die Methode lernen",
    scope: "Umfang der Dokumentation",
    count: "Experimente",
    domains: "technische Themengebiete",
    editions: "vollständige Sprachfassungen",
    dependencies: "Runtime-Abhängigkeiten der Seite",
    featured: "Einstiegspunkte",
    featuredTitle: "Sechs Systeme zum Zerlegen",
    featuredLead:
      "Wähle ein bekanntes Problem. Verstehe die Idee, prüfe das Experiment und baue einen eigenen Kern.",
    paths: "Lernpfade",
    pathsTitle: "Konzepte, die aufeinander aufbauen",
    pathNames: [
      "Daten sicher formen",
      "Asynchrone Arbeit steuern",
      "Systemgrenzen überschreiten",
    ],
    maturityTitle: "Was bedeutet „fertig“?",
    maturityText:
      "Ein Konzept erklärt eine Idee. Ein funktionierendes Experiment demonstriert einen getesteten, dokumentierten Kern. Ein Produktionspaket braucht zusätzlich Kompatibilitätszusagen, Betriebsgrenzen, Integrationsnachweise und Wartung. Ein Badge allein verspricht keine Produktionsreife.",
    directoryTitle: "35 Ideen zum Erkunden",
    directoryLead:
      "Filtere nach Problem, API oder Themengebiet. Jedes Experiment bleibt sichtbar; der Reifegrad beschreibt die Implementierung und ihre Nachweise.",
    filter: "Module filtern",
    all: "Alle",
    categoryFilter: "Nach Themengebiet filtern",
    result: "Module",
    card: "Bauplan lesen",
    understand: "Verstehen",
    sections: [
      "Problem",
      "Denkmodell",
      "Kontrollfluss",
      "Bauteile",
      "Selbst bauen",
      "Verifizieren",
      "Grenzen",
      "Weiterdenken",
    ],
    headings: [
      "Wofür braucht man das?",
      "Das mentale Modell",
      "Was passiert in welcher Reihenfolge?",
      "Die entscheidenden Verträge",
      "Selbst implementieren",
      "Was solltest du testen?",
      "Kompromisse und Stolperfallen",
      "Quellcode und verwandte Ideen",
    ],
    repository: "Im Repository",
    copy: "Code kopieren",
    code: "Konzeptskizze · kann ausgelassene Helfer verwenden",
    important: "Wichtig",
    source: "Quellcode auf GitHub ansehen",
    example: "Geprüftes Beispiel ausführen",
    tests: "Tests ansehen",
    toc: "Auf dieser Seite",
    exercise: "Selbst ausprobieren",
    exerciseIntro:
      "Formuliere die erste Prüfaussage als fehlschlagenden Test, implementiere die kleinste Korrektur und ergänze einen Grenzfall.",
    exerciseAnswer: "Ansatz vergleichen",
    exerciseHint:
      "Dein Test sollte beim gezielten Verletzen der Invariante fehlschlagen und nach der Korrektur wieder bestehen. Halte den Aufbau deterministisch und prüfe ein beobachtbares Ergebnis.",
    guideTitle: "Aus fremdem Code wird ein System, das du verstehst.",
    guideLead:
      "Nutze eine wiederholbare Methode: Vertrag festhalten, einen kleinen Kern bauen und die wichtigen Eigenschaften testen.",
    principles: [
      [
        "Vertrag zuerst",
        "Definiere Eingaben, Ausgaben, Fehler und Invarianten vor dem Klassendesign.",
      ],
      [
        "Kleiner korrekter Kern",
        "Implementiere ein nützliches Verhalten mit einer expliziten Fehlerstrategie.",
      ],
      [
        "Sichtbarer Zustand",
        "Mache Ownership und Zustandsübergänge nachvollziehbar.",
      ],
      [
        "Explizite Grenzen",
        "Abbruch, Größenlimits und Timeouts gehören in den Vertrag.",
      ],
      [
        "Eigenschaften testen",
        "Prüfe Reihenfolge, Determinismus, Ressourcenfreigabe und Roundtrips.",
      ],
      [
        "Abstraktionen begründen",
        "Verallgemeinere, wenn konkrete Implementierungen den Bedarf zeigen.",
      ],
    ],
    checklist: "Bevor ein Experiment als fertig gilt",
    checks: [
      "Baut sein öffentlicher Einstiegspunkt?",
      "Verändert ein Import die Umgebung nicht?",
      "Prüfen echte Tests den dokumentierten Kern und Fehlerpfade?",
      "Werden Ressourcen freigegeben und Eingaben begrenzt?",
      "Passen Beispiele und beide Sprachfassungen zum Code?",
      "Sind offene Integrationen und nächste Schritte explizit?",
    ],
    empty: "Kein Modul gefunden.",
    copied: "Kopiert",
    unavailable: "Kopieren nicht verfügbar",
    notFound: "Diese Dokumentationsseite existiert nicht.",
    choose: "Sprache wählen",
  },
};

const paths = [
  ["assert", "better-map", "better-set", "ts-error", "binary-serializer"],
  [
    "reactivity",
    "state-store",
    "state-machine",
    "task-manager",
    "priority-queue",
    "worker-pool",
  ],
  ["parser-combinator", "signature", "mdns", "p2p", "swarm"],
];
const sectionIds = [
  "problem",
  "model",
  "flow",
  "surface",
  "build",
  "verify",
  "limits",
  "source",
];
const list = (values, ordered = false, className = "plain-list") => {
  const tag = ordered ? "ol" : "ul";
  return `<${tag} class="${className}">${values.map((value) => `<li>${escape(value)}</li>`).join("")}</${tag}>`;
};

await rm(output, { recursive: true, force: true });
for (const locale of ["en", "de"]) {
  const t = copy[locale];
  const modules = locale === "en" ? englishModules : germanModules;
  const categories = localizeCategories(sourceCategories, locale);
  const categoryMap = new Map(
    categories.map((category) => [category.slug, category]),
  );
  const bySlug = new Map(modules.map((module) => [module.slug, module]));
  await mkdir(path.join(output, locale, "assets"), { recursive: true });
  await cp(
    path.join(rootDirectory, "documentation/assets"),
    path.join(output, locale, "assets"),
    { recursive: true },
  );

  const nav = (
    root,
    active,
  ) => `<aside class="sidebar" id="docs-navigation" aria-label="${t.navigation}">
    <div class="sidebar-head"><strong>Navigation</strong><button class="icon-button" type="button" data-nav-close aria-label="${t.close}">×</button></div>
    <section class="nav-section"><h2 class="nav-section-title">Start</h2><ul class="nav-list">${[
      ["home", "", t.overview],
      ["modules", "modules/", t.modules],
      ["guide", "guide/", t.guide],
    ]
      .map(
        ([key, route, label]) =>
          `<li><a href="${root}${route}"${active === key ? ' class="active" aria-current="page"' : ""}>${label}</a></li>`,
      )
      .join("")}</ul></section>
    ${categories
      .map(
        (category) =>
          `<section class="nav-section"><h2 class="nav-section-title">${escape(category.title)}</h2><ul class="nav-list">${modules
            .filter((module) => module.category === category.slug)
            .map(
              (module) =>
                `<li><a href="${root}modules/${module.slug}/"${active === module.slug ? ' class="active" aria-current="page"' : ""}>${escape(module.title)}</a></li>`,
            )
            .join("")}</ul></section>`,
      )
      .join("")}</aside>`;

  const page = (title, description, route, active, body) => {
    const depth = route.split("/").filter(Boolean).length;
    const root = depth ? "../".repeat(depth) : "./";
    const canonical = absolute(locale + "/" + route);
    const alternate = locale === "en" ? "de" : "en";
    return `<!doctype html><html lang="${locale}" data-theme="dark"><head>
      <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="dark light"><meta name="theme-color" content="#07100f">
      <meta name="description" content="${escape(description)}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${canonical}"><meta property="og:locale" content="${locale === "en" ? "en_US" : "de_DE"}"><meta property="og:site_name" content="ts-libs">
      <link rel="canonical" href="${canonical}">${["en", "de"].map((code) => `<link rel="alternate" hreflang="${code}" href="${absolute(code + "/" + route)}">`).join("")}<link rel="alternate" hreflang="x-default" href="${absolute("en/" + route)}">
      <link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${root}assets/styles.css"><title>${escape(title)} · ts-libs</title>
      <script>try{document.documentElement.dataset.theme=localStorage.getItem("ts-libs-docs-theme")||"dark"}catch{}</script><script defer src="${root}assets/search-index.js"></script><script defer src="${root}assets/app.js"></script>
      </head><body data-empty="${escape(t.empty)}" data-copied="${escape(t.copied)}" data-unavailable="${escape(t.unavailable)}" data-modules="${t.result}" data-light="${t.light}" data-dark="${t.dark}">
      <a class="skip-link" href="#main-content">${t.skip}</a><div class="reading-progress" data-reading-progress aria-hidden="true"></div>
      <div class="shell" data-shell><header class="topbar"><div class="top-actions"><button class="icon-button" type="button" data-nav-toggle aria-controls="docs-navigation" aria-expanded="false" aria-label="${t.open}">☰</button><a class="brand" href="${root}" aria-label="${t.home}"><span class="brand-mark" aria-hidden="true">&lt;/&gt;</span><strong>ts-libs</strong><span>/ build-it-yourself</span></a></div>
      <div class="search-wrap" data-search-wrap data-root="${root}"><label class="sr-only" for="global-search">${t.search}</label><input id="global-search" class="search-input" data-search type="search" autocomplete="off" placeholder="${t.placeholder}"><div class="search-results" data-search-results role="status" aria-live="polite" hidden></div></div>
      <div class="top-actions"><a class="small-button language-switch" href="${root}../${alternate}/${route}" lang="${alternate}" hreflang="${alternate}" aria-label="${locales[alternate].label}">${locales[alternate].label}</a><a class="small-button" href="${site.repository}">GitHub</a><button class="small-button" type="button" data-theme-toggle aria-label="${t.theme}"><span data-theme-label>${t.light}</span></button></div></header>
      <div class="layout">${nav(root, active)}<div class="overlay" data-overlay aria-hidden="true"></div><main class="main" id="main-content">${body}</main></div><footer class="footer"><span>${t.footer}</span><span>${t.derived} · MIT</span></footer></div></body></html>`;
  };
  const card = (module, index, root) =>
    `<article class="module-card" data-module-card data-category="${module.category}" data-search="${escape([module.title, module.summary, ...module.tags, ...module.api.map((api) => api.name)].join(" "))}"><div class="card-top"><span class="index-no">${String(index + 1).padStart(2, "0")}</span><span class="status ${module.maturity}">${t.maturity[module.maturity]}</span></div><h3>${escape(module.title)}</h3><p>${escape(module.summary)}</p><div class="module-meta"><span class="tag">${escape(categoryMap.get(module.category).title)}</span></div><a class="card-link" href="${root}modules/${module.slug}/" aria-label="${escape(module.title)} · ${t.card}">${t.card}</a></article>`;
  const learningPaths = `<section class="section"><p class="eyebrow">${t.paths}</p><h2>${t.pathsTitle}</h2><div class="path-grid">${paths.map((slugs, index) => `<article class="path-card"><span class="step">PATH 0${index + 1}</span><h3>${t.pathNames[index]}</h3><ol>${slugs.map((slug) => `<li><a href="modules/${slug}/">${escape(bySlug.get(slug).title)}</a></li>`).join("")}</ol></article>`).join("")}</div></section>`;
  await write(
    locale + "/index.html",
    page(
      locales[locale].site.title,
      locales[locale].site.description,
      "",
      "home",
      `<div class="content"><section class="hero"><div><p class="eyebrow">${t.eyebrow}</p><h1>${t.hero}</h1><p class="lead">${t.lead}</p><div class="button-row"><a class="button primary" href="modules/">${t.explore}</a><a class="button" href="guide/">${t.method}</a></div></div><div class="hero-code" aria-label="${t.scope}">${t.sections
        .slice(0, 5)
        .map(
          (label, index) =>
            `<p><span class="token-key">0${index + 1}</span>: <span class="token-value">${label}</span></p>`,
        )
        .join("")}</div></section>
    <div class="stat-grid" aria-label="${t.scope}">${[
      [modules.length, t.count],
      [categories.length, t.domains],
      [2, t.editions],
      [0, t.dependencies],
    ]
      .map(
        ([number, label]) =>
          `<div class="stat"><strong>${number}</strong><span>${label}</span></div>`,
      )
      .join("")}</div>
    <section class="section"><div class="section-head"><div><p class="eyebrow">${t.featured}</p><h2>${t.featuredTitle}</h2></div><p>${t.featuredLead}</p></div><div class="module-grid">${modules
      .filter((module) => module.featured)
      .slice(0, 6)
      .map((module, index) => card(module, index, "./"))
      .join(
        "",
      )}</div></section>${learningPaths}<section class="section callout"><h2>${t.maturityTitle}</h2><p>${t.maturityText}</p></section></div>`,
    ),
  );
  await write(
    locale + "/modules/index.html",
    page(
      t.modules,
      t.directoryLead,
      "modules/",
      "modules",
      `<div class="content"><p class="eyebrow">${t.modules}</p><h1>${t.directoryTitle}</h1><p class="lead">${t.directoryLead}</p><div class="directory-tools"><label for="module-filter">${t.filter}</label><input id="module-filter" class="search-input" data-module-filter type="search"><div class="filter-row" aria-label="${t.categoryFilter}"><button class="filter-button active" type="button" data-category-filter="all" aria-pressed="true">${t.all}</button>${categories.map((category) => `<button class="filter-button" type="button" data-category-filter="${category.slug}" aria-pressed="false">${escape(category.title)}</button>`).join("")}</div><span data-result-count class="result-count" role="status" aria-live="polite">${modules.length} ${t.result}</span></div><div class="module-grid">${modules.map((module, index) => card(module, index, "../")).join("")}</div></div>`,
    ),
  );

  for (const module of modules) {
    const sections = [
      `<p>${escape(module.problem)}</p>`,
      `<p>${escape(module.mentalModel)}</p><div class="callout"><strong>${t.repository}</strong><p>${escape(module.repositoryImplementation)}</p></div>`,
      list(module.flow, true, "flow-list"),
      `<div class="api-list">${module.api.map((api) => `<div class="api-item"><code>${escape(api.name)}</code><span>${escape(api.description)}</span></div>`).join("")}</div>`,
      `<p>${escape(module.build.intro)}</p>${list(module.build.steps, true, "recipe-list")}<div class="code-block"><div class="code-head"><span>${t.code}</span><button class="copy-button" type="button" data-copy>${t.copy}</button></div><pre><code>${escape(module.build.code)}</code></pre></div>`,
      `${list(module.tests)}<div class="callout exercise"><h3>${t.exercise}</h3><p>${t.exerciseIntro}</p><p><strong>${escape(module.tests[0])}</strong></p><details><summary>${t.exerciseAnswer}</summary><p>${t.exerciseHint}</p></details></div>`,
      `${list(module.tradeoffs)}${module.note ? `<div class="callout"><strong>${t.important}</strong><p>${escape(module.note)}</p></div>` : ""}`,
      `<div class="button-row"><a class="button" href="${site.repository}/tree/main/${module.source}">${t.source}</a><a class="button" href="${site.repository}/blob/main/${module.evidence.example}">${t.example}</a><a class="button" href="${site.repository}/tree/main/${module.evidence.test}">${t.tests}</a></div><div class="code-block"><pre><code>yarn tsx packages/${module.slug}/examples/basic.ts</code></pre></div><div class="related-grid">${(module.related || []).map((slug) => `<a class="related-link" href="../${slug}/">${escape(bySlug.get(slug).title)} →</a>`).join("")}</div>`,
    ];
    const body = `<div class="content narrow"><header class="module-header"><p class="breadcrumb"><a href="../">${t.modules}</a> / ${escape(categoryMap.get(module.category).title)}</p><div class="status-row"><span class="status ${module.maturity}">${t.maturity[module.maturity]}</span><span class="index-no">${escape(module.source)}</span></div><h1>${escape(module.title)}</h1><p class="package-name">${escape(module.packageName)}</p><p class="lead">${escape(module.summary)}</p><div class="filter-row">${module.tags.map((tag) => `<span class="tag">${escape(tag)}</span>`).join("")}</div></header><div class="article-layout"><article class="article">${sections.map((content, index) => `<section id="${sectionIds[index]}"><p class="eyebrow">0${index + 1} · ${t.sections[index]}</p><h2>${t.headings[index]}</h2>${content}</section>`).join("")}</article><nav class="toc" aria-label="${t.toc}"><strong>${t.toc}</strong>${sectionIds.map((id, index) => `<a href="#${id}">${t.sections[index]}</a>`).join("")}</nav></div></div>`;
    await write(
      locale + "/modules/" + module.slug + "/index.html",
      page(
        module.title + " · " + t.understand,
        module.summary,
        "modules/" + module.slug + "/",
        module.slug,
        body,
      ),
    );
  }
  await write(
    locale + "/guide/index.html",
    page(
      t.guide,
      locales[locale].site.description,
      "guide/",
      "guide",
      `<div class="content narrow"><p class="eyebrow">${t.guide}</p><h1>${t.guideTitle}</h1><p class="lead">${t.guideLead}</p><section class="section"><div class="principle-grid">${t.principles.map(([title, text]) => `<article class="principle-card"><h2>${title}</h2><p>${text}</p></article>`).join("")}</div></section><section class="section"><h2>${t.checklist}</h2>${list(t.checks)}</section><section class="section"><h2>${t.maturityTitle}</h2><p>${t.maturityText}</p></section></div>`,
    ),
  );
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
        ...module.api.map((api) => api.name + " " + api.description),
      ].join(" "),
      locale,
    ),
  }));
  await write(
    locale + "/assets/search-index.js",
    "window.__TS_LIBS_SEARCH__ = " +
      JSON.stringify(searchIndex).replaceAll("<", "\\u003c") +
      ";\n",
  );
}

const routes = [
  "",
  "modules/",
  "guide/",
  ...germanModules.map((module) => "modules/" + module.slug + "/"),
];
const redirect = (route, root) =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=${root}en/${route}"><link rel="canonical" href="${absolute("en/" + route)}"><title>ts-libs · English / Deutsch</title></head><body><main><h1>ts-libs</h1><p><a href="${root}en/${route}" lang="en">Continue in English</a> · <a href="${root}de/${route}" lang="de">Auf Deutsch weiterlesen</a></p></main></body></html>`;
for (const route of routes) {
  const depth = route.split("/").filter(Boolean).length;
  await write(
    route + "index.html",
    redirect(route, depth ? "../".repeat(depth) : "./"),
  );
}
await cp(
  path.join(rootDirectory, "documentation/assets"),
  path.join(output, "assets"),
  { recursive: true },
);
await write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${routes.flatMap((route) => ["en", "de"].map((locale) => `<url><loc>${absolute(locale + "/" + route)}</loc>${["en", "de"].map((code) => `<xhtml:link rel="alternate" hreflang="${code}" href="${absolute(code + "/" + route)}"/>`).join("")}<xhtml:link rel="alternate" hreflang="x-default" href="${absolute("en/" + route)}"/></url>`)).join("\n")}</urlset>\n`,
);
await write(
  "robots.txt",
  "User-agent: *\nAllow: /\nSitemap: " + absolute("sitemap.xml") + "\n",
);
await write(".nojekyll", "");
await write(
  "404.html",
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found · ts-libs</title><link rel="icon" href="${absolute("assets/favicon.svg")}"><link rel="stylesheet" href="${absolute("assets/styles.css")}"></head><body><main class="content narrow"><p class="eyebrow">404</p><h1>Page not found / Seite nicht gefunden</h1><p>${copy.en.notFound}</p><p lang="de">${copy.de.notFound}</p><div class="button-row"><a class="button" href="${absolute("en/")}" lang="en">English overview</a><a class="button" href="${absolute("de/")}" lang="de">Deutscher Überblick</a></div></main></body></html>`,
);
console.log(
  "Built " +
    routes.length * 2 +
    " localized documentation pages and " +
    routes.length +
    " compatibility redirects.",
);
