const englishCategories = {
  foundations: {
    title: "Foundations & Data",
    short: "Types, collections, errors, and serialization",
  },
  state: {
    title: "State & Orchestration",
    short: "States, events, queues, and workers",
  },
  network: {
    title: "Networking & Trust",
    short: "Peers, discovery, signatures, and proof of work",
  },
  observability: {
    title: "Parsing & Observability",
    short: "Parsers, metrics, logging, and CLI tooling",
  },
  simulation: {
    title: "Simulation & Generation",
    short: "Randomness, grammars, networks, and WebGL",
  },
};

export const locales = {
  de: {
    code: "de",
    label: "Deutsch",
    site: {
      title: "ts-libs — Systeme selbst verstehen und bauen",
      description:
        "Ein Konzept-Handbuch für 35 TypeScript-Module: Wie sie funktionieren, wie Daten fließen, wo sie scheitern und wie du einen brauchbaren Kern selbst baust.",
    },
    categories: null,
  },
  en: {
    code: "en",
    label: "English",
    site: {
      title: "ts-libs — Build it yourself",
      description:
        "An English concept handbook for 35 TypeScript modules: how they work, how data moves, where they fail, and how to rebuild a useful core.",
    },
    categories: englishCategories,
  },
};

export const localizeCategories = (categories, locale) =>
  categories.map((category) => ({
    ...category,
    ...(locales[locale].categories?.[category.slug] || {}),
  }));
