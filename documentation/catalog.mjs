import { applyEvidence } from "./experiments.mjs";

export const site = {
  title: "ts-libs — Systeme selbst verstehen und bauen",
  description:
    "Ein Konzept-Handbuch für 35 TypeScript-Module: Wie sie funktionieren, wie Daten fließen, wo sie scheitern und wie du einen brauchbaren Kern selbst baust.",
  repository: "https://github.com/ralphschuler/.ts-libs",
  productionUrl: "https://nyphon.de/.ts-libs/",
};

export const categories = [
  {
    slug: "foundations",
    title: "Grundlagen & Daten",
    short: "Typen, Collections, Fehler und Serialisierung",
  },
  {
    slug: "state",
    title: "Zustand & Orchestrierung",
    short: "States, Events, Queues und Worker",
  },
  {
    slug: "network",
    title: "Netzwerk & Vertrauen",
    short: "Peers, Discovery, Signaturen und Proof of Work",
  },
  {
    slug: "observability",
    title: "Parsing & Beobachtbarkeit",
    short: "Parser, Metriken, Logging und CLI-Werkzeuge",
  },
  {
    slug: "simulation",
    title: "Simulation & Generierung",
    short: "Zufall, Grammatiken, Netzwerke und WebGL",
  },
];

// The catalog is intentionally hand-curated from the repository source. It is
// not API reference data and must remain understandable without the packages.
export const sourceModules = [
  {
    slug: "ai-function-caller",
    title: "AI Function Caller",
    packageName: "@ralphschuler/ai-function-caller",
    category: "simulation",
    maturity: "prototype",
    featured: false,
    tags: ["tool calling", "conversation", "OpenAI"],
    summary:
      "Führt eine begrenzte Funktionsschleife mit Argumentprüfung und austauschbarem Provider aus.",
    problem:
      "Ein Sprachmodell kann eine Funktion nur beschreiben und anfordern; Anwendungscode muss den Namen sicher auflösen, Argumente validieren, den Handler ausführen und das Ergebnis wieder in den Dialog einspeisen.",
    mentalModel:
      "Behandle das Modell als untrusted planner in einer begrenzten Schleife. Tool-Schema und ausführbarer Handler sind getrennte Verträge, verbunden über einen kontrollierten Registry-Lookup.",
    repositoryImplementation:
      "Führt eine begrenzte Funktionsschleife mit Argumentprüfung und austauschbarem Provider aus. CI verwendet einen Test-Provider und flache Schemas. Echte Provider-Kompatibilität und fachliche Berechtigungen bleiben Integrationsaufgaben.",
    flow: [
      "User-Nachricht an einen unveränderlich nachvollziehbaren Verlauf anhängen.",
      "Modell mit Nachrichten und ausschließlich öffentlichen Tool-Schemas aufrufen.",
      "Tool-Calls nach Name auflösen und JSON-Argumente gegen das jeweilige Schema prüfen.",
      "Handler ausführen, Ergebnis als Tool-Nachricht speichern und erneut anfragen.",
      "Bei normaler Antwort oder nach einem harten Schrittlimit beenden.",
    ],
    api: [
      {
        name: "AIFunctionCaller.query(message)",
        description:
          "Startet im Repository genau einen Modellaufruf und gibt die Antwortnachricht zurück.",
      },
      {
        name: "AIFunction",
        description:
          "Verbindet Funktionsbeschreibung, Parameter und lokalen Handler; diese Rollen sollten im Nachbau getrennt werden.",
      },
      {
        name: "Message / MessageRole",
        description:
          "Eigene Verlaufstypen, die aktuell nicht deckungsgleich mit den SDK-Nachrichten sind.",
      },
    ],
    build: {
      intro:
        "Baue zuerst eine modellunabhängige Tool-Schleife und injiziere anschließend einen Adapter zum gewünschten Provider.",
      steps: [
        "Definiere Tool-Definition und Handler getrennt und registriere beide unter einem eindeutigen Namen.",
        "Validiere jedes vom Modell gelieferte Argumentobjekt, bevor Anwendungscode es sieht.",
        "Begrenze Schritte, Laufzeit und Ergebnisgröße; leite ein AbortSignal durch alle Aufrufe.",
      ],
      code: String.raw`type Tool = { schema: object; run(input: unknown): Promise<unknown> };

async function runAgent(input: string, signal: AbortSignal) {
  const messages = [{ role: "user", content: input }];
  for (let step = 0; step < 6; step++) {
    const reply = await model.complete(messages, signal);
    messages.push(reply.message);
    if (!reply.toolCalls.length) return reply.message.content;
    for (const call of reply.toolCalls) {
      const tool = tools.get(call.name);
      if (!tool) throw new Error("Unknown tool: " + call.name);
      const args = validate(tool.schema, JSON.parse(call.arguments));
      const value = await tool.run(args);
      messages.push({ role: "tool", content: JSON.stringify(value) });
    }
  }
  throw new Error("Tool-call limit reached");
}`,
    },
    tests: [
      "Ein unbekannter Toolname wird abgelehnt und niemals per Property-Zugriff ausgeführt.",
      "Ungültiges JSON, Schemafehler und Handlerfehler erscheinen als definierter Fehlerpfad.",
      "Schrittlimit, Timeout und Abort beenden auch eine endlose Tool-Call-Kette.",
    ],
    tradeoffs: [
      "Modellantworten sind untrusted input und dürfen keine direkte Codeausführung auslösen.",
      "Gesprächsverläufe wachsen; Kontextfenster und sensible Daten benötigen eine eigene Strategie.",
      "Provider-SDKs ändern Nachrichtentypen und Tool-Protokolle – der Adapter sollte klein bleiben.",
    ],
    note: "CI verwendet einen Test-Provider und flache Schemas. Echte Provider-Kompatibilität und fachliche Berechtigungen bleiben Integrationsaufgaben.",
    source: "packages/ai-function-caller/src",
    related: ["parser-combinator", "ts-error"],
  },
  {
    slug: "assert",
    title: "Assert",
    packageName: "@ralphschuler/assert",
    category: "foundations",
    maturity: "partial",
    featured: true,
    tags: ["type narrowing", "invariants", "errors"],
    summary:
      "Prüft Laufzeitbedingungen mit dazu passendem TypeScript-Narrowing.",
    problem:
      "Statische Typen schützen nicht vor Daten aus JSON, Netzwerk oder falsch aufgerufenen APIs. Kritische Invarianten müssen an der Systemgrenze zur Laufzeit erzwungen werden.",
    mentalModel:
      "Eine Assertion ist ein Gate: Hinter ihr darf der Rest des Programms von einer nachweislich erfüllten Bedingung ausgehen, andernfalls endet der Pfad mit einem klaren Fehler.",
    repositoryImplementation:
      "Prüft Laufzeitbedingungen mit dazu passendem TypeScript-Narrowing. Assertions werfen synchron; verschachtelte Schemas und asynchrone Reject-Prüfungen sind eigene Erweiterungen.",
    flow: [
      "Unbekannten Wert an einer klaren Eingangsgrenze empfangen.",
      "Genau eine überprüfbare Bedingung auswerten.",
      "Bei Fehlschlag einen spezifischen AssertionError mit Kontext werfen.",
      "Bei Erfolg den Typ für nachfolgenden Code verengen.",
    ],
    api: [
      {
        name: "assert(condition, message)",
        description:
          "Basiskontrolle, auf der alle spezialisierten Assertions aufbauen.",
      },
      {
        name: "isString / isNumber / isDefined",
        description: "Laufzeitprüfungen mit TypeScript-Assertion-Signaturen.",
      },
      {
        name: "throws(action)",
        description:
          "Soll erwartetes Werfen prüfen, besteht im Repository aber auch dann, wenn action nichts wirft.",
      },
      {
        name: "AssertionError",
        description: "Unterscheidbarer Fehlertyp für verletzte Vorbedingungen.",
      },
    ],
    build: {
      intro:
        "Beginne mit einem korrekten Basistor und ergänze nur Assertions, deren Runtime-Prüfung exakt zur Type-Narrowing-Aussage passt.",
      steps: [
        "Implementiere assert mit einer asserts-condition-Signatur.",
        "Gib jeder spezialisierten Prüfung eine präzise Fehlermeldung und einen passenden Narrowing-Typ.",
        "Teste positive und negative Pfade getrennt; fange niemals den eigenen AssertionError versehentlich ab.",
      ],
      code: String.raw`class AssertionError extends Error {}

function assert(value: unknown, message = "Assertion failed"): asserts value {
  if (!value) throw new AssertionError(message);
}

function isDefined<T>(value: T): asserts value is Exclude<T, undefined> {
  assert(value !== undefined, "Expected a defined value");
}

function throws(action: () => unknown) {
  let didThrow = false;
  try { action(); } catch { didThrow = true; }
  assert(didThrow, "Expected action to throw");
}`,
    },
    tests: [
      "Jede Assertion besteht für gültige Werte und wirft den erwarteten Fehlertyp für ungültige.",
      "NaN, Infinity, null und undefined werden entsprechend des dokumentierten Vertrags behandelt.",
      "throws und eine optionale rejects-Variante schlagen zuverlässig beim falschen Kontrollfluss fehl.",
    ],
    tradeoffs: [
      "Assertions werfen synchron; für erwartbare Validierungsfehler kann ein Result-Typ geeigneter sein.",
      "Zu allgemeine Assertions verschleiern den eigentlichen Eingabevertrag.",
      "Strukturelle Objektvalidierung benötigt Pfadkontext und meist ein Schema statt vieler Einzelprüfungen.",
    ],
    note: "Assertions werfen synchron; verschachtelte Schemas und asynchrone Reject-Prüfungen sind eigene Erweiterungen.",
    source: "packages/assert/src",
    related: ["ts-error", "functional"],
  },
  {
    slug: "better-map",
    title: "Better Map",
    packageName: "@ralphschuler/better-map",
    category: "foundations",
    maturity: "partial",
    featured: false,
    tags: ["Map", "collections", "merge"],
    summary:
      "Aktualisiert, filtert und vereinigt Map-Einträge mit explizitem Verhalten für fehlende Werte.",
    problem:
      "Beim Arbeiten mit Maps wiederholen sich Muster wie get-transform-set, selektives Kopieren und Konfliktauflösung beim Zusammenführen.",
    mentalModel:
      "Map bleibt die Datenstruktur; Helfer sollten lediglich atomare Collection-Operationen ausdrücken und klar sagen, ob sie die Instanz mutieren oder eine neue erzeugen.",
    repositoryImplementation:
      "Aktualisiert, filtert und vereinigt Map-Einträge mit explizitem Verhalten für fehlende Werte. Werte behalten ihre Referenzidentität; Callbacks sind synchron und können werfen.",
    flow: [
      "Mit has zwischen fehlendem Schlüssel und vorhandenem undefined unterscheiden.",
      "Vorhandenen Wert aktualisieren oder einen expliziten Initialwert erzeugen.",
      "Das Ergebnis genau einmal per set speichern.",
      "Bei Merge-Konflikten eine dokumentierte Resolver-Funktion anwenden.",
    ],
    api: [
      {
        name: "update(key, updater, notset?)",
        description: "Transformiert einen Wert am Schlüssel oder legt ihn an.",
      },
      {
        name: "filter(predicate)",
        description: "Erzeugt eine neue BetterMap aus passenden Einträgen.",
      },
      {
        name: "merge(map, resolve?)",
        description:
          "Führt Einträge mutierend zusammen und löst Konflikte optional per Callback.",
      },
    ],
    build: {
      intro:
        "Der wichtigste Entwurfspunkt ist nicht die Vererbung, sondern eine eindeutige Abwesenheits- und Mutationssemantik.",
      steps: [
        "Prüfe Existenz immer mit has statt über den gelesenen Wert.",
        "Trenne create und update, damit undefined nicht als versteckter Initialwert dient.",
        "Lass mutierende Methoden this zurückgeben oder benenne immutable Varianten ausdrücklich.",
      ],
      code: String.raw`class UpdatingMap<K, V> extends Map<K, V> {
  update(key: K, change: (value: V) => V, create: () => V): this {
    const next = this.has(key) ? change(this.get(key) as V) : create();
    this.set(key, next);
    return this;
  }

  select(predicate: (value: V, key: K) => boolean) {
    const result = new UpdatingMap<K, V>();
    for (const [key, value] of this) {
      if (predicate(value, key)) result.set(key, value);
    }
    return result;
  }
}`,
    },
    tests: [
      "Fehlender Schlüssel, vorhandenes undefined und vorhandenes null bleiben unterscheidbar.",
      "Filter verändert die Quelle nicht und erhält Schlüssel-Wert-Paare.",
      "Merge-Resolver wird ausschließlich bei echten Konflikten aufgerufen.",
    ],
    tradeoffs: [
      "Unterklassen nativer Collections können bei Serialisierung und Cross-Realm-Nutzung überraschen.",
      "Mutierende und immutable Operationen in derselben API brauchen besonders klare Namen.",
    ],
    note: "Werte behalten ihre Referenzidentität; Callbacks sind synchron und können werfen.",
    source: "packages/better-map/src",
    related: ["better-set", "safe-array"],
  },
  {
    slug: "better-set",
    title: "Better Set",
    packageName: "@ralphschuler/better-set",
    category: "foundations",
    maturity: "partial",
    featured: false,
    tags: ["Set", "set algebra", "collections"],
    summary:
      "Demonstriert Vereinigung, Schnittmenge und den bestehenden gerichteten Differenzvertrag.",
    problem:
      "Set-Algebra wird in Anwendungscode oft mit wiederholten Schleifen und leicht verwechselter Differenzrichtung nachgebaut.",
    mentalModel:
      "Ein Set beschreibt Mitgliedschaft. Union, Intersection und Difference sollten als reine Operationen mit eindeutiger Links-rechts-Richtung lesbar sein.",
    repositoryImplementation:
      "Demonstriert Vereinigung, Schnittmenge und den bestehenden gerichteten Differenzvertrag. except berechnet Argument minus Empfänger. Die Richtung bleibt erhalten und ist durch Tests festgehalten.",
    flow: [
      "Zwei Iterables als linke und rechte Menge auffassen.",
      "Für jede Operation die Richtung ausdrücklich festlegen.",
      "Mit has in linearer Zeit Mitgliedschaft prüfen.",
      "Ein neues Set zurückgeben, sofern Mutation nicht Teil des Namens ist.",
    ],
    api: [
      {
        name: "merge(other)",
        description: "Mutierende Vereinigung im vorhandenen Paket.",
      },
      { name: "both(other)", description: "Schnittmenge der beiden Sets." },
      {
        name: "except(other)",
        description:
          "Berechnet aktuell other minus this statt this minus other.",
      },
      {
        name: "filter(predicate)",
        description: "Erzeugt ein BetterSet mit passenden Werten.",
      },
    ],
    build: {
      intro:
        "Implementiere mathematische Operationen zunächst als pure Funktionen; mutierende Kurzformen können später bewusst ergänzt werden.",
      steps: [
        "Akzeptiere Iterable für Union und ReadonlySet für schnelle Mitgliedschaftstests.",
        "Definiere difference(left, right) immer als Werte aus left, die nicht in right liegen.",
        "Gib durchgehend denselben Collection-Typ zurück.",
      ],
      code: String.raw`class SetOps<T> extends Set<T> {
  union(other: Iterable<T>) {
    return new SetOps([...this, ...other]);
  }

  intersection(other: ReadonlySet<T>) {
    return new SetOps([...this].filter(value => other.has(value)));
  }

  difference(other: ReadonlySet<T>) {
    return new SetOps([...this].filter(value => !other.has(value)));
  }
}`,
    },
    tests: [
      "Leere, identische und disjunkte Sets liefern die mathematisch erwarteten Ergebnisse.",
      "difference(A, B) und difference(B, A) werden separat geprüft.",
      "Objekte folgen dokumentiert Referenzgleichheit und Eingaben bleiben unverändert.",
    ],
    tradeoffs: [
      "Native Set-Gleichheit ist SameValueZero, keine strukturelle Objektgleichheit.",
      "Immutable Ergebnisse benötigen zusätzliche Allokationen, sind aber leichter zu komponieren.",
    ],
    note: "except berechnet Argument minus Empfänger. Die Richtung bleibt erhalten und ist durch Tests festgehalten.",
    source: "packages/better-set/src",
    related: ["better-map", "complex-compare"],
  },
  {
    slug: "binary-serializer",
    title: "Binary Serializer",
    packageName: "@ralphschuler/binary-serializer",
    category: "foundations",
    maturity: "prototype",
    featured: false,
    tags: ["binary", "codec", "schema"],
    summary:
      "Serialisiert feste Layouts aus vorzeichenlosen Ganzzahlen, Booleans, UTF-8-Strings und Arrays.",
    problem:
      "Binärformate sparen Platz und geben ein exaktes Wire-Layout vor, verlangen dafür aber konsistente Feldreihenfolge, Größenberechnung, Bounds-Prüfung und Versionierung.",
    mentalModel:
      "Jeder Datentyp ist ein Codec mit drei Operationen: Größe berechnen, ab Offset schreiben und ab Offset lesen. Strukturen komponieren diese kleinen Codecs in expliziter Reihenfolge.",
    repositoryImplementation:
      "Serialisiert feste Layouts aus vorzeichenlosen Ganzzahlen, Booleans, UTF-8-Strings und Arrays. Dies ist ein festes Layout ohne Versionskennung. Schema-Reihenfolge und Migration müssen beide Seiten vereinbaren; Decorators folgen dem Legacy-TypeScript-Vertrag.",
    flow: [
      "Schema mit fester Feldreihenfolge und eindeutigem Typ pro Feld definieren.",
      "Exakte Bytezahl vor der Allokation rekursiv berechnen.",
      "Felder schreiben und den Offset nach jeder Operation fortführen.",
      "Beim Lesen Bounds prüfen, Werte rekonstruieren und finalen Offset zurückgeben.",
      "Formatkennung und Version vor Nutzdaten setzen.",
    ],
    api: [
      {
        name: "@Serializable / @Serialized",
        description: "Legacy-Decorators für Klassen- und Feldschema.",
      },
      {
        name: "@AsNumber / @AsBoolean / @AsString / @AsArray",
        description: "Deklarieren konkrete Binärrepräsentationen.",
      },
      {
        name: "BinarySerializer.serialize / deserialize",
        description: "Schreibt oder liest anhand des gespeicherten Schemas.",
      },
    ],
    build: {
      intro:
        "Ein explizites Codec-Objekt ist leichter zu testen und zu versionieren als implizite Decorator-Metadaten.",
      steps: [
        "Definiere einen Codec-Vertrag, der Wert und Offset gemeinsam weiterreicht.",
        "Baue Primitive wie u32 und bool mit strikten Bereichsprüfungen.",
        "Komponiere Arrays und Structs, ohne Feldreihenfolge aus Reflection abzuleiten.",
      ],
      code: String.raw`type Decoded<T> = { value: T; offset: number };

interface Codec<T> {
  size(value: T): number;
  encode(view: DataView, offset: number, value: T): number;
  decode(view: DataView, offset: number): Decoded<T>;
}

const u32: Codec<number> = {
  size: () => 4,
  encode: (view, at, value) => (view.setUint32(at, value, true), at + 4),
  decode: (view, at) => ({ value: view.getUint32(at, true), offset: at + 4 }),
};`,
    },
    tests: [
      "encode gefolgt von decode ergibt für jedes gültige Objekt denselben Wert und Endoffset.",
      "Zu kurze Buffer, zu große Zahlen und falsche Längen werden vor dem Zugriff abgelehnt.",
      "Bekannte Golden Bytes sichern Endianness, Feldreihenfolge und Versionsheader.",
    ],
    tradeoffs: [
      "Feste Felder sind schnell, aber schlecht erweiterbar; variable Felder benötigen Längenpräfixe.",
      "UTF-8-Längen zählen Bytes, nicht JavaScript-Zeichen.",
      "Schemaänderungen ohne Versionsstrategie machen gespeicherte Daten unlesbar.",
    ],
    note: "Dies ist ein festes Layout ohne Versionskennung. Schema-Reihenfolge und Migration müssen beide Seiten vereinbaren; Decorators folgen dem Legacy-TypeScript-Vertrag.",
    source: "packages/binary-serializer/src",
    related: ["parser-combinator", "signature"],
  },
  {
    slug: "bit-mask",
    title: "Bit Mask",
    packageName: "@ralphschuler/bit-mask",
    category: "foundations",
    maturity: "stub",
    featured: false,
    tags: ["flags", "bitwise", "compact state"],
    summary:
      "Verwaltet validierte unabhängige Feature-Bits über eine öffentliche API.",
    problem:
      "Viele kleine Ja/Nein-Zustände können kompakt gespeichert und sehr schnell kombiniert werden, wenn jeder Zustand genau ein Bit besitzt.",
    mentalModel:
      "Jede erlaubte Flag ist eine Zweierpotenz. OR setzt Bits, AND mit invertierter Maske löscht Bits und AND prüft eine einzelne oder kombinierte Maske.",
    repositoryImplementation:
      "Verwaltet validierte unabhängige Feature-Bits über eine öffentliche API. Number-Bitoperationen unterstützen positive Einzelbits bis Bit 30. Breitere Masken benötigen BigInt.",
    flow: [
      "Jeder Feature-ID genau eine Zweierpotenz zuweisen.",
      "Angeforderte Flags gegen eine erlaubte Menge validieren.",
      "Maske mit OR setzen oder mit AND-NOT löschen.",
      "Bei Abfrage alle angeforderten Bits vergleichen.",
    ],
    api: [
      {
        name: "BitwiseFeatureFlags (intern)",
        description:
          "Nicht exportierte Klasse mit einer numerischen Gesamtmaske.",
      },
      {
        name: "enableFlag / disableFlag",
        description: "Setzen oder löschen Bits nach einer Validierung.",
      },
      {
        name: "isFlagEnabled",
        description: "Prüft, ob alle Bits einer Flagmaske gesetzt sind.",
      },
    ],
    build: {
      intro:
        "Validiere das Datenmodell beim Erzeugen; ungültige Flags sollten später nicht nur geloggt werden.",
      steps: [
        "Akzeptiere nur positive einzelne Zweierpotenzen als Basisflags.",
        "Wirf bei unbekannten Flags einen definierten Fehler.",
        "Nutze bigint, sobald mehr als 31 unabhängige Bits benötigt werden.",
      ],
      code: String.raw`class Flags {
  private mask = 0;
  constructor(private allowed: ReadonlySet<number>) {}

  private check(flag: number) {
    if (!this.allowed.has(flag)) throw new RangeError("Unknown flag");
  }
  enable(flag: number) { this.check(flag); this.mask |= flag; }
  disable(flag: number) { this.check(flag); this.mask &= ~flag; }
  has(flag: number) { this.check(flag); return (this.mask & flag) === flag; }
  value() { return this.mask; }
}`,
    },
    tests: [
      "Jedes erlaubte Bit lässt sich unabhängig setzen und löschen.",
      "Kombinierte Abfragen bestehen nur, wenn alle enthaltenen Bits gesetzt sind.",
      "Null, Nicht-Zweierpotenzen, unbekannte und zu große Flags werden abgelehnt.",
    ],
    tradeoffs: [
      "Number-Bitoperatoren arbeiten als signed 32-bit Integer.",
      "Bitmasken sind kompakt, aber ohne Symboltabelle schlecht lesbar und migrationsanfällig.",
    ],
    note: "Number-Bitoperationen unterstützen positive Einzelbits bis Bit 30. Breitere Masken benötigen BigInt.",
    source: "packages/bit-mask/src",
    related: ["state-store", "binary-serializer"],
  },
  {
    slug: "cli",
    title: "CLI",
    packageName: "@ralphschuler/cli",
    category: "observability",
    maturity: "stub",
    featured: false,
    tags: ["argv", "commands", "middleware"],
    summary: "Verarbeitet validierte argv-Befehle mit abgewarteter Middleware.",
    problem:
      "Eine CLI braucht einen deterministischen Parser, typisierte Wertkonvertierung, verständliche Fehler, Help-Ausgabe und einen klaren Übergang zum Command-Handler.",
    mentalModel:
      "Registry wählt den Command, Parser erzeugt einen validierten Context, Middleware umschließt den Handler und ein Renderer übersetzt Fehler in Exit-Code und Hilfe.",
    repositoryImplementation:
      "Verarbeitet validierte argv-Befehle mit abgewarteter Middleware. argv-Arrays erhalten Shell-Quoting. Interaktive Eingabe und Shell-Completion sind separate Adapter.",
    flow: [
      "Erstes Token gegen eine Command-Registry auflösen.",
      "Restliche Tokens quote-aware in Positionals und Flags zerlegen.",
      "Rohwerte per Command-Schema konvertieren, Defaults setzen und validieren.",
      "Middleware als Onion-Kette ausführen und zuletzt den Command-Handler aufrufen.",
      "Fehler in stabile Exit-Codes und gezielte Hilfe übersetzen.",
    ],
    api: [
      {
        name: "Cli (leer)",
        description:
          "Die vorhandene exportlose Klasse enthält noch keine Implementierung.",
      },
      {
        name: "CommandSpec (beabsichtigt)",
        description:
          "Soll Name, Arguments, Flags, Validatoren und run-Handler verbinden.",
      },
      {
        name: "HelloWorldCommand (unvollständig)",
        description:
          "Skizziert eine Command-Definition, kann mit den fehlenden Basistypen aber nicht bauen.",
      },
    ],
    build: {
      intro:
        "Halte Tokenisierung, Schemaauswertung und Ausführung getrennt – so lässt sich jede Schicht ohne Prozessstart testen.",
      steps: [
        "Definiere Commands als Datenobjekte mit Parsern für jeden Wert.",
        "Parse argv ohne Seiteneffekte in einen Context oder einen typisierten Fehler.",
        "Komponiere Middleware und injiziere stdout, stderr und Exit-Verhalten.",
      ],
      code: String.raw`type Command = {
  name: string;
  parse(tokens: string[]): Record<string, unknown>;
  run(context: Record<string, unknown>): Promise<void>;
};

async function runCli(argv: string[], commands: Map<string, Command>) {
  const [name, ...tokens] = argv;
  const command = commands.get(name);
  if (!command) throw new Error("Unknown command: " + name);
  const context = command.parse(tokens);
  await command.run(context);
}`,
    },
    tests: [
      "Pflichtargumente, Defaults, lange und kurze Flags werden deterministisch geparst.",
      "Unbekannte Commands, Flags und zusätzliche Positionals liefern gezielte Fehler.",
      "Middleware-Reihenfolge, Async-Fehler und Exit-Code-Mapping werden mit injizierten Streams geprüft.",
    ],
    tradeoffs: [
      "Shell-Quoting ist meist bereits vom Betriebssystem verarbeitet; ein eigener Stringparser braucht andere Regeln.",
      "Automatische Typmagie erschwert Fehlermeldungen – explizite Value-Parser sind besser testbar.",
    ],
    note: "argv-Arrays erhalten Shell-Quoting. Interaktive Eingabe und Shell-Completion sind separate Adapter.",
    source: "packages/cli/src",
    related: ["logger", "assert"],
  },
  {
    slug: "complex-compare",
    title: "Complex Compare",
    packageName: "@ralphschuler/complex-compare",
    category: "foundations",
    maturity: "prototype",
    featured: false,
    tags: ["diff", "objects", "pure functions"],
    summary:
      "Berechnet gerichtete Array-Differenzen und flache Änderungen eigener Objektschlüssel ohne globale Mutation.",
    problem:
      "Konfigurationen und Snapshots müssen häufig zeigen, welche Schlüssel hinzugefügt, entfernt oder verändert wurden.",
    mentalModel:
      "Ein Diff ist eine Menge adressierbarer Änderungen mit before und after. Die Vergleichstiefe und Gleichheitssemantik müssen Teil des Vertrags sein.",
    repositoryImplementation:
      "Berechnet gerichtete Array-Differenzen und flache Änderungen eigener Objektschlüssel ohne globale Mutation. Objektwerte werden per Identität verglichen; tiefer Strukturvergleich liegt außerhalb des Kerns.",
    flow: [
      "Vereinigung aller eigenen Schlüssel beider Objekte bilden.",
      "Werte mit einer festgelegten Gleichheitsfunktion vergleichen.",
      "Nur abweichende Paare als before/after erfassen.",
      "Array-Differenz über ein Set der ausgeschlossenen Werte berechnen.",
    ],
    api: [
      {
        name: "Array.prototype.difference (global)",
        description:
          "Filtert Werte des linken Arrays, die rechts nicht enthalten sind.",
      },
      {
        name: "Object.difference (global)",
        description:
          "Erzeugt einen flachen Record aus Tupeln alter und neuer Werte.",
      },
      {
        name: "DiffResult (intern)",
        description: "Typ für Änderungen, der nicht exportiert wird.",
      },
    ],
    build: {
      intro:
        "Pure Funktionen vermeiden Namenskollisionen, enumerable Prototype-Properties und überraschende Seiteneffekte beim Import.",
      steps: [
        "Nimm beide Werte explizit als Parameter statt native Prototypen zu patchen.",
        "Benutze Object.keys und Object.is für ein klares flaches Diff.",
        "Behandle Deep-Diff, Array-Mengenlogik und Patch-Erzeugung als getrennte Erweiterungen.",
      ],
      code: String.raw`function objectDiff(
  left: Record<string, unknown>,
  right: Record<string, unknown>,
) {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  const changes = new Map<string, { before: unknown; after: unknown }>();
  for (const key of keys) {
    if (!Object.is(left[key], right[key])) {
      changes.set(key, { before: left[key], after: right[key] });
    }
  }
  return changes;
}`,
    },
    tests: [
      "Hinzugefügte, entfernte und auf undefined gesetzte Keys bleiben unterscheidbar.",
      "NaN, -0 und Referenzobjekte folgen der dokumentierten Gleichheitssemantik.",
      "Der Import verändert weder Array.prototype noch Object und Eingaben bleiben unverändert.",
    ],
    tradeoffs: [
      "Ein flaches Diff ist schnell, erkennt aber Änderungen innerhalb verschachtelter Objekte nicht.",
      "Deep-Diffs benötigen Zyklenerkennung und eine definierte Behandlung von Map, Set und Klasseninstanzen.",
    ],
    note: "Objektwerte werden per Identität verglichen; tiefer Strukturvergleich liegt außerhalb des Kerns.",
    source: "packages/complex-compare/src",
    related: ["better-set", "state-store"],
  },
  {
    slug: "functional",
    title: "Functional",
    packageName: "@ralphschuler/functional",
    category: "foundations",
    maturity: "prototype",
    featured: false,
    tags: ["Option", "Result", "discriminated unions"],
    summary:
      "Exportiert markierte Option- und Result-Werte, Guards und Pattern Matching.",
    problem:
      "null, undefined und Exceptions verstecken alternative Pfade. Option und Result machen diese Pfade zu sichtbaren Varianten im Typ.",
    mentalModel:
      "Jeder Wert trägt einen eindeutigen Tag. Consumer müssen vor dem Zugriff die Variante prüfen oder alle Varianten durch einen Matcher behandeln.",
    repositoryImplementation:
      "Exportiert markierte Option- und Result-Werte, Guards und Pattern Matching. Hüllen sind flach eingefroren; Fehlerfang und höhere Kombinatoren bleiben explizite Erweiterungen.",
    flow: [
      "Erfolg, Fehler oder Abwesenheit als unveränderliche getaggte Variante erzeugen.",
      "Mit dem Tag verengen statt Felder oder Truthiness zu erraten.",
      "Transformationen nur auf der passenden Erfolgsvariante anwenden.",
      "Am Systemrand exhaustiv in Ausgabe, HTTP-Status oder Exception übersetzen.",
    ],
    api: [
      {
        name: "Option = Some | None (intern)",
        description: "Explizite Anwesenheit eines Werts.",
      },
      {
        name: "Result = Ok | Err (intern)",
        description: "Expliziter Erfolg oder fachlicher Fehler.",
      },
      {
        name: "isSome / isOk / match (intern)",
        description:
          "Type Guards und Pattern-Matching-Helfer ohne Package-Export.",
      },
    ],
    build: {
      intro:
        "Discriminated Unions benötigen kaum Runtime-Code; die Qualität entsteht aus präzisen Kombinatoren und exhaustiven Switches.",
      steps: [
        "Definiere separate Tags und Payload-Felder für jede Variante.",
        "Baue kleine Konstruktoren sowie map und flatMap für Erfolgspfade.",
        "Nutze never-Checks, damit neue Varianten Compilerfehler an unvollständigen Matchern erzeugen.",
      ],
      code: String.raw`type Result<T, E> =
  | { tag: "ok"; value: T }
  | { tag: "err"; error: E };

const ok = <T>(value: T): Result<T, never> => ({ tag: "ok", value });
const err = <E>(error: E): Result<never, E> => ({ tag: "err", error });

function map<A, B, E>(result: Result<A, E>, fn: (value: A) => B): Result<B, E> {
  return result.tag === "ok" ? ok(fn(result.value)) : result;
}`,
    },
    tests: [
      "map verändert ausschließlich Ok/Some und lässt Err/None unverändert.",
      "flatMap propagiert den ersten Fehler ohne den nächsten Schritt auszuführen.",
      "Exhaustive Matcher werden typseitig gegen neue Varianten abgesichert.",
    ],
    tradeoffs: [
      "Result-Werte müssen konsequent behandelt werden; gemischte Exception- und Result-Semantik wird schnell unübersichtlich.",
      "Zu viele generische Kombinatoren können TypeScript-Inferenz und Fehlermeldungen verschlechtern.",
    ],
    note: "Hüllen sind flach eingefroren; Fehlerfang und höhere Kombinatoren bleiben explizite Erweiterungen.",
    source: "packages/functional/src",
    related: ["ts-error", "assert"],
  },
  {
    slug: "i811n",
    title: "i811n",
    packageName: "@ralphschuler/i811n",
    category: "observability",
    maturity: "stub",
    featured: false,
    tags: ["localization", "interpolation", "Intl"],
    summary:
      "Löst Sprachkataloge auf und ersetzt Platzhalter durch literale Werte.",
    problem:
      "UI-Texte sollen unabhängig von Komponenten organisiert, sicher umgeschaltet und mit Laufzeitwerten ergänzt werden.",
    mentalModel:
      "Ein Katalog ist Locale → Key → Template. Eine kleine zustandsbehaftete Fassade wählt das aktive Locale; Formatierung bleibt eine separate Aufgabe.",
    repositoryImplementation:
      "Löst Sprachkataloge auf und ersetzt Platzhalter durch literale Werte. Eine Pluralnachrichtensyntax ist nicht implementiert. Für Datum, Zahlen und Pluralauswahl eignet sich Intl.",
    flow: [
      "Aktives und Fallback-Locale gegen den Katalog prüfen.",
      "Template erst im aktiven, dann im Fallback-Katalog suchen.",
      "Bekannte Platzhalter über einen festen Parser ersetzen.",
      "Fehlende Keys sichtbar melden statt still leere Strings zu liefern.",
    ],
    api: [
      {
        name: "TranslationManager (intern)",
        description: "Hält Katalog und aktuelles Locale.",
      },
      {
        name: "Translator.translate (intern)",
        description: "Löst einen Key auf und interpoliert Variablen.",
      },
      {
        name: "Intl.*",
        description:
          "Native Erweiterung für Plural-, Zahlen- und Datumsformatierung.",
      },
    ],
    build: {
      intro:
        "Leite Locale- und Keytypen direkt aus einem const-Katalog ab und verwende für Platzhalter einen festen Ausdruck ohne dynamische RegExp.",
      steps: [
        "Validiere initiales und neues Locale gegen vorhandene Kataloge.",
        "Implementiere eine klare Fallback-Kette für fehlende Keys.",
        "Delegiere Zahl, Datum und Pluralisierung an Intl statt eigene Regeln zu erfinden.",
      ],
      code: String.raw`function createI18n<C extends Record<string, Record<string, string>>>(
  catalog: C,
  initial: keyof C,
  fallback: keyof C,
) {
  let locale = initial;
  return {
    setLocale(next: keyof C) { locale = next; },
    t(key: string, vars: Record<string, string> = {}) {
      const text = catalog[locale][key] ?? catalog[fallback][key] ?? "[" + key + "]";
      return text.replace(/\{([^}]+)\}/g, (_, name) => vars[name] ?? "{" + name + "}");
    },
  };
}`,
    },
    tests: [
      "Aktives Locale, Fallback-Locale und fehlender Key werden getrennt geprüft.",
      "Unbekannte und mehrfach vorkommende Platzhalter bleiben sicher und deterministisch.",
      "Locale-Wechsel verändert neue Übersetzungen, aber nicht bereits erzeugte Strings.",
    ],
    tradeoffs: [
      "Template-Interpolation ersetzt kein ICU-MessageFormat für komplexe Grammatik.",
      "Große Kataloge sollten pro Locale geladen werden, was eine Async-Schnittstelle erfordert.",
    ],
    note: "Eine Pluralnachrichtensyntax ist nicht implementiert. Für Datum, Zahlen und Pluralauswahl eignet sich Intl.",
    source: "packages/i811n/src",
    related: ["cli", "state-store"],
  },
  {
    slug: "logger",
    title: "Logger",
    packageName: "@ralphschuler/logger",
    category: "observability",
    maturity: "partial",
    featured: false,
    tags: ["structured logs", "terminal", "levels"],
    summary:
      "Formatiert Meldungen mit korrigiertem Level-Filter, begrenzter Historie und expliziter Ausgabe.",
    problem:
      "Diagnose braucht konsistente Level, strukturierte Metadaten und austauschbare Ausgaben, ohne Geschäftslogik an process.stdout oder process.exit zu koppeln.",
    mentalModel:
      "Ein LogRecord ist Daten. Ein Formatter übersetzt ihn, ein Sink schreibt ihn; TTY-Animationen sind ein optionaler Renderer oberhalb dieses Kerns.",
    repositoryImplementation:
      "Formatiert Meldungen mit korrigiertem Level-Filter, begrenzter Historie und expliziter Ausgabe. Das Singleton bleibt kompatibel; direkte Konstruktion erlaubt isolierte Tests. Fatal-Logs beenden den Prozess nicht.",
    flow: [
      "Level, Nachricht, Timestamp und Metadaten zu einem Record formen.",
      "Record vor Formatierung gegen eine klar geordnete Schwelle prüfen.",
      "Formatter erzeugt Text oder JSON ohne die Ursprungsdaten zu verändern.",
      "Ein injizierter Sink schreibt; Terminaleffekte laufen nur bei isTTY.",
    ],
    api: [
      {
        name: "Logger.getInstance",
        description:
          "Liefert das globale Singleton und soll Format, Level und Stream konfigurieren.",
      },
      {
        name: "trace / debug / info / warn / error / fatal",
        description: "Level-spezifische Schreibmethoden.",
      },
      {
        name: "profile / profileSync",
        description:
          "Misst Laufzeit und verbindet sie mit einer Terminalanimation.",
      },
      {
        name: "addBreadcrumb / showBreadcrumbs",
        description: "Speichert und zeigt vorherige Meldungen.",
      },
    ],
    build: {
      intro:
        "Baue einen kleinen Logger ohne Globals; JSON, hübsche Konsole und Animationen können danach als getrennte Adapter folgen.",
      steps: [
        "Definiere eine monotone Levelreihenfolge und teste die Schwelle als reine Funktion.",
        "Injiziere Sink, Uhr und Formatter über den Konstruktor.",
        "Lass fatal nie im Kern den Prozess beenden; der Aufrufer entscheidet über Lifecycle.",
      ],
      code: String.raw`type Level = 10 | 20 | 30 | 40 | 50;
type Record = { at: Date; level: Level; message: string; meta?: object };

class Logger {
  constructor(
    private threshold: Level,
    private write: (record: Record) => void,
    private now = () => new Date(),
  ) {}

  log(level: Level, message: string, meta?: object) {
    if (level < this.threshold) return;
    this.write({ at: this.now(), level, message, meta });
  }
}`,
    },
    tests: [
      "Für jede Schwelle werden exakt die erlaubten Level an den Sink weitergegeben.",
      "Metadaten bleiben strukturiert und Formatterfehler verändern den Record nicht.",
      "Nicht-TTY-Sinks starten keine Animation; Exceptions stoppen Timer zuverlässig.",
    ],
    tradeoffs: [
      "Synchrone Sinks sind einfach, können unter Last aber blockieren.",
      "Unbegrenzte Breadcrumbs und Metadaten können Speicher und sensible Daten akkumulieren.",
      "Terminalsteuerung ist plattform- und TTY-abhängig.",
    ],
    note: "Das Singleton bleibt kompatibel; direkte Konstruktion erlaubt isolierte Tests. Fatal-Logs beenden den Prozess nicht.",
    source: "packages/logger/src",
    related: ["stats-tracker", "prom-metrics-decorator"],
  },
  {
    slug: "lsystem",
    title: "L-System",
    packageName: "@ralphschuler/lsystem",
    category: "simulation",
    maturity: "partial",
    featured: false,
    tags: ["grammar", "procedural", "stochastic"],
    summary:
      "Schreibt Symbolfolgen mit normalisierten Gewichten und austauschbarer Zufallsquelle um.",
    problem:
      "Pflanzen, Fraktale und prozedurale Formen lassen sich kompakt als Axiom plus lokale Umschreibregeln beschreiben.",
    mentalModel:
      "Jede Generation liest ausschließlich die vorherige Symbolfolge und baut eine neue. Stochastische Regeln wählen pro Symbol eine Transformation aus einer validierten Gewichtsverteilung.",
    repositoryImplementation:
      "Schreibt Symbolfolgen mit normalisierten Gewichten und austauschbarer Zufallsquelle um. Ausgabe kann exponentiell wachsen. Rendering und anwendungsspezifische Ausgabelimits sind von der Grammatik getrennt.",
    flow: [
      "Regeln einmal nach Ursprungssymbol gruppieren und Gewichte validieren.",
      "Für jede Iteration eine frische Ausgabefolge erzeugen.",
      "Für jedes Symbol eine Regel über injizierten Zufall wählen oder es unverändert übernehmen.",
      "Transformationssymbole einzeln anhängen und vor einem Größenlimit stoppen.",
    ],
    api: [
      {
        name: "LSystem(axiom, rules)",
        description: "Speichert Startfolge und stochastische Umschreibregeln.",
      },
      {
        name: "generate(iterations)",
        description: "Wendet Regeln generationenweise auf jedes Symbol an.",
      },
      {
        name: "Rule / SymbolType",
        description:
          "Beschreibt Ursprung, Transformation und Wahrscheinlichkeit.",
      },
    ],
    build: {
      intro:
        "Nutze Symbolarrays statt impliziter String-Coercion und injiziere Zufall für reproduzierbare Generationen.",
      steps: [
        "Indiziere Regeln pro Symbol und normalisiere positive Gewichte.",
        "Erzeuge jede Generation aus einem unveränderten Snapshot der vorherigen.",
        "Begrenze Iterationen und maximale Symbolzahl vor unkontrolliertem Wachstum.",
      ],
      code: String.raw`type Rule<S> = { weight: number; replacement: readonly S[] };

function expand<S>(
  input: readonly S[],
  rules: ReadonlyMap<S, readonly Rule<S>[]>,
  random: () => number,
) {
  const output: S[] = [];
  for (const symbol of input) {
    const rule = chooseWeighted(rules.get(symbol) ?? [], random());
    output.push(...(rule?.replacement ?? [symbol]));
  }
  return output;
}`,
    },
    tests: [
      "Deterministischer RNG erzeugt erwartete Generationen und Randgewichte.",
      "Symbole ohne Regel bleiben erhalten; mehrere Ersatzsymbole enthalten keine Kommas.",
      "Ungültige Gewichte und Überschreiten des Größenlimits führen zu klaren Fehlern.",
    ],
    tradeoffs: [
      "Materialisierte Folgen können exponentiell wachsen; Streaming erschwert spätere Generationen.",
      "Stochastische Ergebnisse sind ohne Seed nicht reproduzierbar.",
    ],
    note: "Ausgabe kann exponentiell wachsen. Rendering und anwendungsspezifische Ausgabelimits sind von der Grammatik getrennt.",
    source: "packages/lsystem/src",
    related: ["random", "webgl-sand-engine"],
  },
  {
    slug: "mdns",
    title: "mDNS",
    packageName: "@ralphschuler/mdns",
    category: "network",
    maturity: "prototype",
    featured: false,
    tags: ["multicast", "DNS-SD", "LAN discovery"],
    summary:
      "Bietet ein deterministisches lokales Discovery-Modell und einen explizit gestarteten Multicast-Adapter.",
    problem:
      "Geräte im selben LAN sollen Dienste finden, ohne einen zentralen DNS-Server oder fest konfigurierte IP-Adressen zu benötigen.",
    mentalModel:
      "mDNS ist eine gemeinschaftliche Multicast-Zone. Queries werden nicht wie RPCs korreliert, sondern Antworten für Name und Typ innerhalb eines kurzen Fensters gesammelt.",
    repositoryImplementation:
      "Bietet ein deterministisches lokales Discovery-Modell und einen explizit gestarteten Multicast-Adapter. MDNS prüft TTL und Cleanup lokal; NetworkMDNS sammelt verzögerte Netzwerkantworten über multicast-dns. CI injiziert den Transport; Interface-Auswahl und geräteübergreifende Zuverlässigkeit bleiben Integrationsarbeit.",
    flow: [
      "UDP-Multicast-Socket für Port 5353 öffnen und Response-Listener zuerst registrieren.",
      "Standardkonforme Frage mit Name und Typ senden.",
      "Passende Answer- und Additional-Records während eines Sammelfensters erfassen.",
      "Records normalisieren und deduplizieren, danach Listener und Timer entfernen.",
      "Beim Shutdown alle ausstehenden Queries abbrechen und Socket schließen.",
    ],
    api: [
      {
        name: "MDNS.query(name, type)",
        description: "Soll einen passenden DNSRecord als Promise auflösen.",
      },
      {
        name: "MDNS.announce(name, type, ttl, data)",
        description:
          "Registriert im Repository einen Record, sendet aber keine proaktive Announcement-Response.",
      },
      {
        name: "destroy()",
        description:
          "Entfernt Listener und zerstört die multicast-dns-Instanz.",
      },
      {
        name: "DNSRecord / DNSType",
        description:
          "Typen für A, AAAA, PTR, TXT und SRV ohne vollständig gekoppelte Payloads.",
      },
    ],
    build: {
      intro:
        "Verwende das normale DNS-Protokoll und korreliere über Name, Typ und Zeitfenster statt über proprietäre Request-IDs.",
      steps: [
        "Modelliere Record-Typ und Payload als diskriminierte Union.",
        "Registriere Listener vor dem Senden und sammle mehrere Antworten bis zum Timeout.",
        "Bereinige Listener, Timeout und Pending-Promise bei Erfolg, Fehler, Abort und Shutdown.",
      ],
      code: String.raw`async function query(name: string, type: string, signal: AbortSignal) {
  const answers: unknown[] = [];
  const onResponse = (packet: any) => {
    for (const record of [...packet.answers, ...packet.additionals]) {
      if (record.name === name && (type === "ANY" || record.type === type)) {
        answers.push(record);
      }
    }
  };
  socket.on("response", onResponse);
  try { socket.query({ questions: [{ name, type }] }); await delay(500, signal); }
  finally { socket.off("response", onResponse); }
  return deduplicate(answers);
}`,
    },
    tests: [
      "Mehrere Antworten, Duplikate und fremde Name/Typ-Kombinationen werden korrekt behandelt.",
      "Timeout, Abort und destroy entfernen Listener und settle'n jedes Promise genau einmal.",
      "PTR, SRV, TXT, A und AAAA behalten jeweils die richtige Datenform.",
    ],
    tradeoffs: [
      "mDNS funktioniert nur innerhalb einer Multicast-Domain und ist kein Internet-Service-Discovery.",
      "Antworten sind untrusted; Service-Metadaten beweisen keine Identität.",
      "Betriebssysteme und Netzwerke können Multicast filtern oder bündeln.",
    ],
    note: "MDNS prüft TTL und Cleanup lokal; NetworkMDNS sammelt verzögerte Netzwerkantworten über multicast-dns. CI injiziert den Transport; Interface-Auswahl und geräteübergreifende Zuverlässigkeit bleiben Integrationsarbeit.",
    source: "packages/mdns/src",
    related: ["p2p", "swarm"],
  },
  {
    slug: "mixin-class-factory",
    title: "Mixin Class Factory",
    packageName: "@ralphschuler/mixin-class-factory",
    category: "foundations",
    maturity: "prototype",
    featured: false,
    tags: ["composition", "decorators", "config"],
    summary:
      "Kombiniert Instanzfelder und Prototypmethoden mit validierten Konfigurationsdefaults.",
    problem:
      "Mehrere orthogonale Fähigkeiten sollen in einer Klasse zusammenkommen, obwohl TypeScript nur eine Basisklasse erlaubt.",
    mentalModel:
      "Ein Mixin ist eine Transformation von Basisklasse zu erweiterter Basisklasse. Config-Schemas werden zusammengeführt, Konflikte vor der Instanziierung entschieden.",
    repositoryImplementation:
      "Kombiniert Instanzfelder und Prototypmethoden mit validierten Konfigurationsdefaults. Namenskollisionen werden abgelehnt. Native private Felder lassen sich nicht in eine fremde Instanz verpflanzen.",
    flow: [
      "Mixin-Verträge und Config-Schemas einsammeln.",
      "Namens- und Typkonflikte vor der Klassenerzeugung erkennen.",
      "Defaults in eine neue Config kopieren, vollständig validieren und erst dann einfrieren.",
      "Prototype-Descriptors oder standardmäßige Class-Mixin-Ketten anwenden.",
    ],
    api: [
      {
        name: "ConfigProperty(type, defaultValue)",
        description:
          "Legacy-Decorator für erwartete Configfelder; Default wird aktuell nicht angewendet.",
      },
      {
        name: "InterfaceMethod()",
        description: "Sammelt Methodennamen, die createClass nicht auswertet.",
      },
      {
        name: "createClass(...mixins)",
        description:
          "Erzeugt asynchron einen Konstruktor und kopiert nur Instanzfelder.",
      },
    ],
    build: {
      intro:
        "Bevorzuge TypeScript-Class-Mixins; sie erhalten Methoden und Typinformation ohne Runtime-Reflection.",
      steps: [
        "Definiere ein gemeinsames Constructor-Generic.",
        "Jedes Mixin gibt eine Unterklasse der erhaltenen Basis zurück.",
        "Komponiere Mixins explizit und behandle Config über normale Konstruktorparameter.",
      ],
      code: String.raw`type Constructor<T = object> = new (...args: any[]) => T;

const WithLogging = <B extends Constructor>(Base: B) =>
  class extends Base {
    log(message: string) { console.log(message); }
  };

const WithId = <B extends Constructor>(Base: B) =>
  class extends Base { readonly id = crypto.randomUUID(); };

class Empty {}
class Service extends WithLogging(WithId(Empty)) {}`,
    },
    tests: [
      "Komponierte Instanzen besitzen Methoden und Felder aller Mixins.",
      "Konfliktstrategie für gleiche Methodennamen ist festgelegt und getestet.",
      "Config-Defaults, ungültige Typen und unveränderte Eingabeobjekte werden geprüft.",
    ],
    tradeoffs: [
      "Mixin-Ketten können komplexe Constructor- und Generic-Typen erzeugen.",
      "Runtime-Komposition braucht Property-Descriptors und verliert oft instanceof-Semantik.",
    ],
    note: "Namenskollisionen werden abgelehnt. Native private Felder lassen sich nicht in eine fremde Instanz verpflanzen.",
    source: "packages/mixin-class-factory/src",
    related: ["functional", "state-store"],
  },
  {
    slug: "neuronal-network",
    title: "Neuronal Network",
    packageName: "@ralphschuler/neuronal-network",
    category: "simulation",
    maturity: "prototype",
    featured: false,
    tags: ["neural network", "backpropagation", "matrix"],
    summary:
      "Führt numerische Vorwärtsberechnung und gradientenbasiertes Lernen mit Formprüfungen aus.",
    problem:
      "Ein dichtes neuronales Netz approximiert eine Funktion, indem es gewichtete Summen durch nichtlineare Aktivierungen schickt und Fehler rückwärts verteilt.",
    mentalModel:
      "Layer sind Matrizen statt rekursiver Objektgraphen. Forward erzeugt Aktivierungen; Backprop berechnet Deltas; ein Optimizer aktualisiert Gewichte und Biases.",
    repositoryImplementation:
      "Führt numerische Vorwärtsberechnung und gradientenbasiertes Lernen mit Formprüfungen aus. Das didaktische Sigmoid-Netz nutzt Gradienten des quadratischen Fehlers. Es ist kein Tensor- oder GPU-Framework.",
    flow: [
      "Eingabevektor auf erwartete Layerbreite prüfen.",
      "Pro Layer Matrix-Vektor-Produkt plus Bias berechnen und aktivieren.",
      "Loss zwischen Ausgabe und Ziel bestimmen.",
      "Deltas mit Ableitungen rückwärts durch die Layer propagieren.",
      "Gewichte und Biases um Learning-Rate mal Gradient aktualisieren.",
    ],
    api: [
      {
        name: "Neuron<T>",
        description:
          "Speichert Verbindungen und Bias, nutzt den Bias im Repository aber nicht.",
      },
      {
        name: "Layer<T>",
        description: "Erzeugt mehrere Neuronen und vollständige Verbindungen.",
      },
      {
        name: "Network<T>.activate / train",
        description:
          "Soll Forward und Training ausführen; propagate aktualisiert gegenwärtig keine Parameter.",
      },
      {
        name: "toObject",
        description:
          "Versucht den zyklischen Verbindungsgraph rekursiv zu serialisieren.",
      },
    ],
    build: {
      intro:
        "Implementiere ein kleines numerisches Dense-Netz und beweise Lernen zunächst an XOR, bevor du Generics oder Graphen ergänzt.",
      steps: [
        "Speichere Gewichte als number[][] und Biases als number[] mit validierten Shapes.",
        "Implementiere Forward inklusive Aktivierung und bewahre Zwischenwerte für Backprop auf.",
        "Berechne Gradienten und aktualisiere Parameter mit einer expliziten Learning Rate.",
      ],
      code: String.raw`type Layer = { weights: number[][]; biases: number[] };

function forward(input: number[], layers: Layer[]) {
  const activations = [input];
  for (const layer of layers) {
    const previous = activations.at(-1) as number[];
    const next = layer.weights.map((row, output) => {
      const sum = row.reduce((value, weight, i) => value + weight * previous[i], 0);
      return 1 / (1 + Math.exp(-(sum + layer.biases[output])));
    });
    activations.push(next);
  }
  return activations;
}`,
    },
    tests: [
      "Forward eines kleinen Netzes stimmt mit handberechneten Werten überein.",
      "Numerischer Gradient und Backprop-Gradient liegen innerhalb einer engen Toleranz.",
      "XOR-Loss sinkt reproduzierbar unter einen festgelegten Wert.",
    ],
    tradeoffs: [
      "Objektgraphen sind anschaulich, Matrizen aber einfacher, schneller und serialisierbar.",
      "Math.random ohne Seed verhindert reproduzierbare Trainingsfehler.",
      "Ein Lernbeispiel ist keine produktive ML-Bibliothek; numerische Stabilität und Batching fehlen.",
    ],
    note: "Das didaktische Sigmoid-Netz nutzt Gradienten des quadratischen Fehlers. Es ist kein Tensor- oder GPU-Framework.",
    source: "packages/neuronal-network/src",
    related: ["random", "state-machine"],
  },
  {
    slug: "p2p",
    title: "P2P",
    packageName: "@ralphschuler/p2p",
    category: "network",
    maturity: "stub",
    featured: false,
    tags: ["peer-to-peer", "framing", "discovery"],
    summary:
      "Startet TCP-Peers explizit und überträgt größenbegrenzte Frames mit Längenpräfix.",
    problem:
      "Peers müssen sich finden, eine stabile Identität aushandeln, Nachrichten begrenzen und Vertraulichkeit sowie Authentizität über eine Session sicherstellen.",
    mentalModel:
      "Discovery verrät nur eine Adresse. Ein Handshake bestätigt Identität und Fähigkeiten; danach transportieren längengerahmte, sequenzierte Nachrichten über eine etablierte sichere Session.",
    repositoryImplementation:
      "Startet TCP-Peers explizit und überträgt größenbegrenzte Frames mit Längenpräfix. Lokale Discovery ist der Standard; NetworkMDNS lässt sich mit einem veröffentlichten Netzwerk-Hostnamen injizieren. TCP-Daten sind unverschlüsselt; Vertrauensaufbau, Authentifizierung und Replay-Schutz benötigen ein vollständiges Protokoll.",
    flow: [
      "Per mDNS nur nodeId, Host, Port und öffentlichen Fingerprint ankündigen.",
      "Transport verbinden und Peer über TLS oder ein geprüftes Handshake-Protokoll authentifizieren.",
      "Stabile Node-IDs und Protokollversionen austauschen; Self- und Duplicate-Verbindungen ablehnen.",
      "Nachrichten mit Länge, Typ und Sequenz framen und harte Maximalgrößen erzwingen.",
      "Backpressure, Heartbeat, Reconnect und vollständigen Shutdown implementieren.",
    ],
    api: [
      {
        name: "P2P",
        description:
          "Beabsichtigter Coordinator für Server, mDNS-Discovery und Peer-Lifecycle.",
      },
      {
        name: "Peer",
        description:
          "EventEmitter um einen TCP-Socket mit send und Datenverarbeitung.",
      },
      {
        name: "KeyPairEncryption",
        description:
          "Soll RSA signieren und verschlüsseln, ist aber unvollständig und nicht importfähig.",
      },
      {
        name: "PeerInfo",
        description: "Adress- und Identitätsdaten eines entdeckten Peers.",
      },
    ],
    build: {
      intro:
        "Baue kein eigenes Kryptoprotokoll. Beginne mit klarem Framing und verwende eine etablierte sichere Transportschicht.",
      steps: [
        "Trenne Discovery, Transport, Session und Peer-Registry in eigene Ports.",
        "Nutze TLS oder Noise und binde den erwarteten Fingerprint an einen Trust Store.",
        "Erzwinge Frame-Limits, Sequenzen, Timeouts und idempotenten Lifecycle.",
      ],
      code: String.raw`type Frame = { type: number; sequence: number; payload: Uint8Array };

function encodeFrame(frame: Frame) {
  const body = encodeBody(frame);
  if (body.length > 1_048_576) throw new RangeError("Frame too large");
  const output = new Uint8Array(4 + body.length);
  new DataView(output.buffer).setUint32(0, body.length);
  output.set(body, 4);
  return output;
}

function acceptSequence(last: number, next: number) {
  if (next !== last + 1) throw new Error("Invalid sequence");
}`,
    },
    tests: [
      "TCP-Chunks mit halbem, genau einem und mehreren Frames werden korrekt reassembliert.",
      "Zu große Frames, Replay-Sequenzen und falsche Peer-Fingerprints werden vor Payload-Verarbeitung abgelehnt.",
      "Disconnect, Timeout und destroy räumen Server, Sockets, Timer und Discovery vollständig auf.",
    ],
    tradeoffs: [
      "mDNS entdeckt nur Peers im lokalen Netz; Internet-P2P braucht Rendezvous, NAT-Traversal oder Relay.",
      "Direct RSA encryption eignet sich nicht für beliebige Payloads; Sessions verwenden symmetrische AEAD-Keys.",
      "Discovery-Metadaten sind ohne nachfolgenden Trust-Check nicht vertrauenswürdig.",
    ],
    note: "Lokale Discovery ist der Standard; NetworkMDNS lässt sich mit einem veröffentlichten Netzwerk-Hostnamen injizieren. TCP-Daten sind unverschlüsselt; Vertrauensaufbau, Authentifizierung und Replay-Schutz benötigen ein vollständiges Protokoll.",
    source: "packages/p2p/src",
    related: ["mdns", "signature"],
  },
  {
    slug: "parser-combinator",
    title: "Parser Combinator",
    packageName: "@ralphschuler/parser-combinator",
    category: "observability",
    maturity: "partial",
    featured: true,
    tags: ["parsing", "backtracking", "binary"],
    summary:
      "Kombiniert byteorientierte Parser mit korrekten Input-Ausschnitten und Fortschrittsprüfung bei Wiederholung.",
    problem:
      "Protokolle und Grammatiken brauchen Sequenz, Alternativen, Wiederholung und gute Fehlerpositionen, ohne einen monolithischen handgeschriebenen Parser zu erzeugen.",
    mentalModel:
      "Ein Parser ist eine pure Funktion von Inputzustand zu Erfolg plus neuem Offset oder Fehler plus Position. Kombinatoren verkabeln diese Zustandsübergänge.",
    repositoryImplementation:
      "Kombiniert byteorientierte Parser mit korrekten Input-Ausschnitten und Fortschrittsprüfung bei Wiederholung. Die Bibliothek besitzt viele Kombinatoren; Regressionstests konzentrieren sich auf Kombination, View-Grenzen und Terminierung.",
    flow: [
      "Input als unveränderliche Byteview plus aktuellen Offset modellieren.",
      "Primitive lesen genau einen Vertrag und liefern neuen Zustand oder erwartetes Token.",
      "Sequenz reicht Erfolg weiter; Alternative startet vom ursprünglichen Zustand.",
      "Bei mehreren Fehlern die weiteste Position und erwartete Tokens zusammenführen.",
      "parseAll kombiniert den Zielparser mit einem expliziten End-of-input-Parser.",
    ],
    api: [
      {
        name: "Parser.map / chain / ap",
        description:
          "Transformiert Resultate oder wählt den nächsten zustandsabhängigen Parser.",
      },
      {
        name: "sequenceOf / choice / many / exactly",
        description: "Kombiniert Reihenfolge, Alternativen und Wiederholung.",
      },
      {
        name: "char / str / regex / digit / letter",
        description: "Stringprimitive auf einem UTF-8-Byteinput.",
      },
      {
        name: "lookAhead / possibly / recursiveParser",
        description:
          "Kontrolliert Konsum, Optionalität und rekursive Grammatiken.",
      },
    ],
    build: {
      intro:
        "Beginne mit einem minimalen Result-Typ und map/flatMap/orElse. Wiederholung und Komfortsyntax kommen erst nach korrekter Fortschritts- und Fehlersemantik.",
      steps: [
        "Definiere State, Success und Failure mit explizitem Offset.",
        "Implementiere map, flatMap und orElse ohne den Eingabestate zu mutieren.",
        "Breche many ab, wenn ein erfolgreicher Parser den Offset nicht erhöht.",
      ],
      code: String.raw`type State = { input: Uint8Array; offset: number };
type Result<T> =
  | { ok: true; value: T; state: State }
  | { ok: false; offset: number; expected: Set<string> };

class Parser<T> {
  constructor(readonly parse: (state: State) => Result<T>) {}
  map<U>(fn: (value: T) => U) {
    return new Parser<U>(state => {
      const result = this.parse(state);
      return result.ok ? { ...result, value: fn(result.value) } : result;
    });
  }
}`,
    },
    tests: [
      "Sequenz, Alternative und Backtracking erhalten den korrekten ursprünglichen oder fortgeschrittenen Offset.",
      "many erkennt einen erfolgreichen Nullfortschritt und terminiert mit einem definierten Fehler.",
      "UTF-8, TypedArray-Slices, Inputende und der weiteste kombinierte Fehler werden geprüft.",
    ],
    tradeoffs: [
      "Vollständiges Backtracking kann exponentiell werden; commit/cut begrenzt bewusste Alternativen.",
      "Bytepositionen sind für Binärdaten korrekt, für Nutzerfehler in Unicode-Texten aber erklärungsbedürftig.",
      "Ein gemeinsamer Parser für Text und Binärdaten erhöht Flexibilität und Typkomplexität zugleich.",
    ],
    note: "Die Bibliothek besitzt viele Kombinatoren; Regressionstests konzentrieren sich auf Kombination, View-Grenzen und Terminierung.",
    source: "packages/parser-combinator/src",
    related: ["binary-serializer", "prom-metrics-parser"],
  },
  {
    slug: "priority-queue",
    title: "Priority Queue",
    packageName: "@ralphschuler/priority-queue",
    category: "state",
    maturity: "prototype",
    featured: true,
    tags: ["binary heap", "scheduling", "MongoDB"],
    summary:
      "Entnimmt Werte aus Array- und injizierten MongoDB-Heaps in Comparator-Reihenfolge.",
    problem:
      "Eine FIFO-Queue reicht nicht, wenn Dringlichkeit und stabile Reihenfolge bestimmen sollen, welcher Job als Nächstes läuft.",
    mentalModel:
      "Ein binärer Heap hält am Root das beste Element. push repariert den Pfad nach oben, pop ersetzt den Root durch das letzte Element und repariert nach unten.",
    repositoryImplementation:
      "Entnimmt Werte aus Array- und injizierten MongoDB-Heaps in Comparator-Reihenfolge. Persistenz erfordert explizite Initialisierung und einen Writer. Atomare MongoDB-Transaktionen für mehrere Clients liegen außerhalb des Basiskerns.",
    flow: [
      "Element am echten Arrayende einfügen und gegen Eltern vergleichen.",
      "Solange es höher priorisiert ist, mit dem Elternknoten tauschen.",
      "Beim pop Root sichern, letztes Element entfernen und gegebenenfalls nach vorne setzen.",
      "Mit dem besseren Kind tauschen, bis die Heap-Invariante wieder gilt.",
      "Gleiche Priorität über eine monotone Sequenz stabil ordnen.",
    ],
    api: [
      {
        name: "ConcretePriorityQueue",
        description:
          "Array-Backend, das entfernte Slots aktuell auf null setzt statt die Länge zu verkürzen.",
      },
      {
        name: "MemoryPriorityQueue",
        description:
          "Eigenes Längenmodell, das Index, Kapazität und Elementanzahl verwechselt.",
      },
      {
        name: "MongoDBPriorityQueue",
        description:
          "Persistenter Heap mit nicht atomaren Swaps und nicht abgewarteter Initialisierung.",
      },
      {
        name: "enqueue / dequeue / peek / heapSort",
        description: "Gemeinsame abstrakte Queue-Operationen.",
      },
    ],
    build: {
      intro:
        "Baue zuerst einen korrekten synchronen In-Memory-Heap. Persistenz ist ein anderes Datenmodell und sollte atomare Datenbankoperationen nutzen.",
      steps: [
        "Nutze ausschließlich items.length als Elementanzahl.",
        "Implementiere bubble-up und bubble-down mit einem synchronen Comparator.",
        "Für persistente Jobs speichere priority plus sequence und claim'e atomar per sortiertem findOneAndUpdate.",
      ],
      code: String.raw`class Heap<T> {
  private items: T[] = [];
  constructor(private compare: (a: T, b: T) => number) {}

  push(value: T) {
    this.items.push(value);
    for (let i = this.items.length - 1; i > 0;) {
      const parent = Math.floor((i - 1) / 2);
      if (this.compare(this.items[i], this.items[parent]) >= 0) break;
      [this.items[i], this.items[parent]] = [this.items[parent], this.items[i]];
      i = parent;
    }
  }
}`,
    },
    tests: [
      "Zufällige push/pop-Sequenzen liefern dieselbe Reihenfolge wie ein vollständig sortiertes Referenzarray.",
      "Leere, ein-elementige und duplikate Queues erhalten Länge und Heap-Invariante.",
      "Gleiche Prioritäten bleiben über sequence stabil; konkurrierende Persistenz-Claims liefern jeden Job einmal.",
    ],
    tradeoffs: [
      "Ein Heap bietet O(log n) push/pop, aber keine schnelle Suche oder Entfernung beliebiger Elemente.",
      "Async-Comparatoren machen jede Reparatur langsam und race-anfällig.",
      "Ein Heap über viele Mongo-Dokumente ist kein atomarer verteilter Heap; sortierte Job-Claims passen besser zur Datenbank.",
    ],
    note: "Persistenz erfordert explizite Initialisierung und einen Writer. Atomare MongoDB-Transaktionen für mehrere Clients liegen außerhalb des Basiskerns.",
    source: "packages/priority-queue/src",
    related: ["task-manager", "worker-pool"],
  },
  {
    slug: "prom-metrics-decorator",
    title: "Prometheus Metrics Decorator",
    packageName: "@ralphschuler/prom-metrics-decorator",
    category: "observability",
    maturity: "prototype",
    featured: false,
    tags: ["Prometheus", "decorators", "metrics"],
    summary:
      "Verwendet benannte Metriken wieder und erfasst Counter, Gauges, Histogramme und Summaries.",
    problem:
      "Querschnittliche Telemetrie soll ergänzt werden, ohne in jede Geschäftsoperation denselben Messcode zu kopieren.",
    mentalModel:
      "Ein Wrapper legt sich um die Originaloperation und aktualisiert eine einmalig registrierte Metrik; Typ, Labels und beobachteter Wert sind explizite Konfiguration.",
    repositoryImplementation:
      "Verwendet benannte Metriken wieder und erfasst Counter, Gauges, Histogramme und Summaries. Legacy-Decorators erfordern passende TypeScript-Einstellungen. Labels brauchen begrenzte Kardinalität; Klassendekoration stellt einen Metrik-Handle bereit.",
    flow: [
      "Metrikkonfiguration validieren und über einen stabilen Namen einmalig registrieren.",
      "Originalmethode unter Erhalt von this und Argumenten aufrufen.",
      "Calls, Wert, Dauer oder Fehler mit passenden Labels beobachten.",
      "Sync- und Async-Ergebnis unverändert an den Aufrufer zurückgeben.",
    ],
    api: [
      {
        name: "PromCounter / PromGauge",
        description:
          "Legacy-Decorators für Zähler und veränderliche Messwerte.",
      },
      {
        name: "PromHistogram / PromSummary",
        description:
          "Exportiert, aber im vorhandenen trackMetric ohne observe-Pfad.",
      },
      {
        name: "TrackOption.Calls / Value",
        description: "Wählt Aufrufzählung oder Messung des Rückgabewerts.",
      },
      {
        name: "IMetricConfig",
        description:
          "Verbindet Metriktyp, Prometheus-Konfiguration und Track-Modus.",
      },
    ],
    build: {
      intro:
        "Beginne mit einer normalen Wrapperfunktion; Decorator-Syntax kann später dieselbe getestete Instrumentierung aufrufen.",
      steps: [
        "Definiere eine minimale Metrikschnittstelle und eine Registry pro Prozess.",
        "Cache Metriken anhand Name plus Typ statt sie pro Invocation zu erzeugen.",
        "Erfasse Promise-Erfolg und -Fehler erst nach Settlement.",
      ],
      code: String.raw`type Counter = { inc(labels?: Record<string, string>): void };

function countCalls<A extends unknown[], R>(
  counter: Counter,
  run: (...args: A) => R,
) {
  return function (this: unknown, ...args: A): R {
    counter.inc();
    return run.apply(this, args);
  };
}`,
    },
    tests: [
      "Mehrere Aufrufe nutzen dieselbe registrierte Metrik und erhöhen sie exakt einmal je Call.",
      "this, Argumente, Rückgabewert und geworfener Fehler bleiben unverändert.",
      "Async-Dauer und Rejection werden erst beim Settlement mit korrekten Labels erfasst.",
    ],
    tradeoffs: [
      "Decorators reduzieren Boilerplate, verstecken Observability aber im Metaprogramming.",
      "Hohe Label-Kardinalität kann Prometheus-Speicher und Abfragen massiv belasten.",
      "Property-Decorators sind bei instanzlokalem State besonders fehleranfällig.",
    ],
    note: "Legacy-Decorators erfordern passende TypeScript-Einstellungen. Labels brauchen begrenzte Kardinalität; Klassendekoration stellt einen Metrik-Handle bereit.",
    source: "packages/prom-metrics-decorator/src",
    related: ["prom-metrics-parser", "stats-tracker"],
  },
  {
    slug: "prom-metrics-parser",
    title: "Prometheus Metrics Parser",
    packageName: "@ralphschuler/prom-metrics-parser",
    category: "observability",
    maturity: "prototype",
    featured: false,
    tags: ["Prometheus", "lexer", "text format"],
    summary:
      "Parst Metrikfamilien, Metadaten, escapte Labels und vollständige Zahlenwerte.",
    problem:
      "Menschenlesbare Metrics-Exposition muss für Analyse oder Transformation strukturiert und ohne stille Teilakzeptanz geparst werden.",
    mentalModel:
      "HELP und TYPE gehören zu einer benannten Familie; Sample-Zeilen besitzen eigenen Namen, quote-aware Labels, Wert und optional weitere Felder.",
    repositoryImplementation:
      "Parst Metrikfamilien, Metadaten, escapte Labels und vollständige Zahlenwerte. Der Parser unterstützt Prometheus-Text-Exposition, nicht sämtliche OpenMetrics-Erweiterungen.",
    flow: [
      "Eingabe zeilenweise lesen und Leerzeilen überspringen.",
      "HELP- und TYPE-Direktiven nach Familienname speichern.",
      "Samplekopf mit einem quote- und escape-aware Lexer zerlegen.",
      "Sample seiner Familie zuordnen und vollständigen Zahlenwert validieren.",
    ],
    api: [
      {
        name: "parsePrometheusMetrics (intern)",
        description: "Nicht exportierte Hauptfunktion über den gesamten Text.",
      },
      {
        name: "parseSample (intern)",
        description: "Liest Namen, einfachen Labelblock und Wert.",
      },
      {
        name: "parseLabels (intern)",
        description:
          "Teilt stumpf an Komma und Gleichheitszeichen; Escapes fehlen.",
      },
    ],
    build: {
      intro:
        "Unterstütze zunächst einen klar begrenzten Subset und lehne alles außerhalb davon sichtbar ab.",
      steps: [
        "Direktiven vor Samples erkennen und pro Familienname zwischenspeichern.",
        "Sample-Zeilen am Value-Feld trennen und den Kopf separat lexen.",
        "Labels zeichenweise innerhalb von Quotes und Escape-Sequenzen lesen.",
      ],
      code: String.raw`type Sample = { name: string; value: number };

function parseSimpleSample(line: string): Sample {
  const split = line.lastIndexOf(" ");
  if (split < 1) throw new Error("Incomplete sample");
  const head = line.slice(0, split).trim();
  const raw = line.slice(split + 1).trim();
  const value = Number(raw);
  if (Number.isNaN(value)) throw new Error("Invalid value");
  const brace = head.indexOf("{");
  const name = head.slice(0, brace < 0 ? head.length : brace);
  if (!name) throw new Error("Missing metric name");
  return { name, value };
}`,
    },
    tests: [
      "Mehrere Familien behalten eigene HELP-, TYPE- und Sample-Daten.",
      "Escaped Quotes, Kommas und Gleichheitszeichen in Labelwerten werden korrekt gelesen.",
      "NaN, +Inf, -Inf, Timestamp und ungültige Restzeichen folgen dem dokumentierten Subset.",
    ],
    tradeoffs: [
      "Split-basierter Code ist kurz, akzeptiert aber komplexe Labelsyntax falsch.",
      "Ein Lexer ist robuster, muss dafür präzise Zustände und Fehlerspannen pflegen.",
      "Vollständige OpenMetrics-Unterstützung ist wesentlich größer als ein einfacher Prometheus-Subset.",
    ],
    note: "Der Parser unterstützt Prometheus-Text-Exposition, nicht sämtliche OpenMetrics-Erweiterungen.",
    source: "packages/prom-metrics-parser/src",
    related: ["parser-combinator", "prom-metrics-decorator"],
  },
  {
    slug: "proof-of-work",
    title: "Proof of Work",
    packageName: "@ralphschuler/proof-of-work",
    category: "network",
    maturity: "prototype",
    featured: false,
    tags: ["SHA-256", "nonce", "rate limiting"],
    summary:
      "Erzeugt und prüft SHA-256-Präfixbeweise mit Event-Loop-Freigabe und Abbruch.",
    problem:
      "Ein Client soll vor einer Anfrage nachweisbar Rechenarbeit leisten, deren Prüfung wesentlich günstiger als ihre Suche ist.",
    mentalModel:
      "Der Miner variiert eine eindeutig codierte Nonce, bis der Hash unter dem Ziel liegt. Der Prüfer hasht genau einmal und kontrolliert dasselbe Ziel.",
    repositoryImplementation:
      "Erzeugt und prüft SHA-256-Präfixbeweise mit Event-Loop-Freigabe und Abbruch. Schwierigkeit zählt wiederholte Hex-Präfixe. Protokollkodierung und externe Rechenbudgets liegen beim Aufrufer.",
    flow: [
      "Difficulty als endliche ganze Zahl im Hashbereich validieren.",
      "Nutzdaten und Nonce kollisionsfrei in Bytes codieren.",
      "SHA-256 berechnen und Zielpräfix prüfen.",
      "In begrenzten Batches fortfahren oder auf Abort reagieren.",
      "Zur Verifikation Hash neu berechnen; mitgelieferten Hash nicht blind vertrauen.",
    ],
    api: [
      {
        name: "ProofOfWork.mine (intern)",
        description: "Sucht synchron blockierend nach Nonce und Hash.",
      },
      {
        name: "ProofOfWork.validate (intern)",
        description: "Berechnet erneut und prüft Hash plus Präfix.",
      },
    ],
    build: {
      intro:
        "Nutze WebCrypto oder node:crypto und verschiebe hohe Difficulty in einen Worker.",
      steps: [
        "Difficulty, Noncebereich und eindeutiges Encoding festlegen.",
        "Hashfunktion als austauschbaren, deterministischen Port implementieren.",
        "Batchgröße, Fortschritt, Attempt-Limit und AbortSignal anbieten.",
      ],
      code: String.raw`async function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function validate(data: string, nonce: number, difficulty: number) {
  if (!Number.isInteger(difficulty) || difficulty < 0 || difficulty > 64) return false;
  const hash = await sha256Hex(data.length + ":" + data + ":" + nonce);
  return hash.startsWith("0".repeat(difficulty));
}`,
    },
    tests: [
      "Gefundene Nonce validiert, veränderte Nutzdaten oder Nonce validieren nicht.",
      "Negative, gebrochene, NaN- und zu große Difficulty werden abgelehnt.",
      "Abort beendet eine lange Suche zeitnah und Worker werden aufgeräumt.",
    ],
    tradeoffs: [
      "Mehr Difficulty erhöht Kosten exponentiell und benachteiligt schwache Geräte.",
      "Event-Loop-Yields halten die UI reaktionsfähig, Worker bieten echte Parallelität.",
      "Proof of Work verhindert Missbrauch nicht allein und ist energieintensiv.",
    ],
    note: "Schwierigkeit zählt wiederholte Hex-Präfixe. Protokollkodierung und externe Rechenbudgets liegen beim Aufrufer.",
    source: "packages/proof-of-work/src",
    related: ["signature", "worker-pool"],
  },
  {
    slug: "random",
    title: "Random",
    packageName: "@ralphschuler/random",
    category: "simulation",
    maturity: "partial",
    featured: true,
    tags: ["PRNG", "seed", "weighted selection"],
    summary:
      "Bietet reproduzierbare Seed-Generatoren und normalisierte gewichtete Auswahl.",
    problem:
      "Simulationen und Tests benötigen reproduzierbare Folgen statt des globalen und nicht seedbaren Math.random.",
    mentalModel:
      "Ein Seed initialisiert einen endlichen Zustand. Jede Transition produziert einen Integer und den nächsten Zustand; Float- und Bereichsfunktionen sind sichere Abbildungen darauf.",
    repositoryImplementation:
      "Bietet reproduzierbare Seed-Generatoren und normalisierte gewichtete Auswahl. Fortuna ist ein Kompatibilitätsname für node:crypto, keine Fortuna-Implementierung. Seed-Strategien dienen Simulationen; die Redis-Skizze ist eine explizit nicht unterstützte Integration.",
    flow: [
      "Seed auf eine feste, gültige Zustandsbreite normalisieren.",
      "Pro Abruf exakt eine deterministische State-Transition ausführen.",
      "Unsigned Integer in [0, 1) oder ohne Modulo-Bias in einen Integerbereich abbilden.",
      "Gewichtete Auswahl über positive Rohgewichte und kumulative Intervalle ausführen.",
    ],
    api: [
      {
        name: "Seed",
        description:
          "Bufferbasierter Seedcontainer mit fehleranfälliger Hexkonvertierung.",
      },
      {
        name: "PseudoRandomNumberGenerator",
        description:
          "Basisklasse für nextFloat und nextInt, nutzt aktuell Math.random.",
      },
      {
        name: "MersenneTwister / XORShift / weitere Strategien",
        description: "Konkrete Zustandsalgorithmen.",
      },
      {
        name: "PseudoRandomItemSelector",
        description:
          "Wählt Items anhand als Prozent interpretierten Gewichten.",
      },
    ],
    build: {
      intro:
        "Ein Xorshift32 genügt als kleiner reproduzierbarer Generator; Sicherheit ist ausdrücklich nicht sein Ziel.",
      steps: [
        "Seed als von null verschiedenen uint32 normalisieren.",
        "State ausschließlich über die definierte Bittransition verändern.",
        "Durch 2^32 teilen, damit nextFloat niemals 1 ergibt.",
      ],
      code: String.raw`class XorShift32 {
  private state: number;
  constructor(seed: number) { this.state = seed >>> 0 || 0x9e3779b9; }

  nextUint32() {
    let value = this.state;
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    return (this.state = value >>> 0);
  }

  nextFloat() { return this.nextUint32() / 0x1_0000_0000; }
}`,
    },
    tests: [
      "Gleiche Seeds liefern über viele Schritte exakt gleiche Folgen.",
      "Jeder Float liegt in [0, 1) und jede Integerabbildung im verlangten Bereich.",
      "Gewichtete Auswahl lehnt leere, negative, NaN- und vollständig nullgewichtete Listen ab.",
    ],
    tradeoffs: [
      "Kleine PRNGs sind schnell und statistisch begrenzt.",
      "Große Zustände verbessern Perioden, machen Snapshot und Restore teurer.",
      "Keiner dieser Algorithmen darf für Schlüssel, Tokens oder andere Sicherheitswerte verwendet werden.",
    ],
    note: "Fortuna ist ein Kompatibilitätsname für node:crypto, keine Fortuna-Implementierung. Seed-Strategien dienen Simulationen; die Redis-Skizze ist eine explizit nicht unterstützte Integration.",
    source: "packages/random/src",
    related: ["lsystem", "slot-mashine"],
  },
  {
    slug: "reactivity",
    title: "Reactivity",
    packageName: "@ralphschuler/reactivity",
    category: "state",
    maturity: "prototype",
    featured: false,
    tags: ["Observable", "subscription", "operators"],
    summary:
      "Verwaltet Cold-Source-Subscriptions mit unabhängiger Terminierung und genau einmaligem Teardown.",
    problem:
      "Asynchrone oder mehrfache Werte sollen produziert, transformiert und unabhängig abbestellt werden können.",
    mentalModel:
      "Jede Subscription besitzt ihren eigenen closed-Zustand und Teardown. Ein Operator erstellt lediglich ein neues Observable, das die Quelle abonniert.",
    repositoryImplementation:
      "Verwaltet Cold-Source-Subscriptions mit unabhängiger Terminierung und genau einmaligem Teardown. Die Operatorauswahl ist bewusst klein. Hot-Multicasting, Backpressure und Scheduler benötigen zusätzliche Verträge.",
    flow: [
      "Producer erhält einen sicheren Observer pro Subscription.",
      "next liefert Werte nur solange diese Subscription offen ist.",
      "error oder complete schließen sie genau einmal.",
      "unsubscribe führt den Teardown idempotent aus.",
      "Operatoren leiten Werte und Fehler an ihre eigenen Subscriber weiter.",
    ],
    api: [
      {
        name: "SimpleObservable",
        description:
          "Source-Klasse für subscribe und pipe ohne Package-Root-Export.",
      },
      {
        name: "SimpleSubscription",
        description: "Kapselt einen Teardown und einen Unsubscribe-Zustand.",
      },
      {
        name: "map / filter",
        description: "any-typisierte Operatoren auf einem Quellobservable.",
      },
      {
        name: "done",
        description: "Identitätsoperator ohne terminale Wirkung.",
      },
    ],
    build: {
      intro:
        "Implementiere zuerst Subscription-Lifecycle und sichere Observer, bevor Operatoren hinzukommen.",
      steps: [
        "Observer mit next, error und complete definieren.",
        "Pro subscribe einen lokalen closed-Schalter und idempotenten Teardown erzeugen.",
        "Operator-Callbackfehler in den Error-Kanal übersetzen.",
      ],
      code: String.raw`type Observer<T> = {
  next(value: T): void;
  error(error: unknown): void;
  complete(): void;
};

class Subscription {
  private closed = false;
  constructor(private teardown: () => void) {}
  unsubscribe() {
    if (this.closed) return;
    this.closed = true;
    this.teardown();
  }
}`,
    },
    tests: [
      "Unsubscribe eines Subscribers beeinflusst keinen zweiten Subscriber.",
      "Teardown läuft auch bei wiederholtem Unsubscribe genau einmal.",
      "Nach error oder complete werden keine weiteren Signale geliefert.",
    ],
    tradeoffs: [
      "Cold Observables isolieren Subscriber, starten Producer aber mehrfach.",
      "Hot Multicasting teilt Arbeit und benötigt gemeinsamen Lifecycle sowie Backpressure-Regeln.",
      "Eine kleine API ist lehrreich, ersetzt nicht Scheduling und Operatorbreite von RxJS.",
    ],
    note: "Die Operatorauswahl ist bewusst klein. Hot-Multicasting, Backpressure und Scheduler benötigen zusätzliche Verträge.",
    source: "packages/reactivity/src",
    related: ["state-store", "state-machine"],
  },
  {
    slug: "safe-array",
    title: "Safe Array",
    packageName: "@ralphschuler/safe-array",
    category: "foundations",
    maturity: "prototype",
    featured: false,
    tags: ["iteration", "deferred mutation", "collection"],
    summary:
      "Verarbeitet gepufferte Mutationen ohne wiederholte Adds oder geteilte Konstruktor-Arrays.",
    problem:
      "Direktes Hinzufügen oder Entfernen während forEach kann Elemente überspringen, doppelt besuchen oder die Schleifenlogik schwer vorhersagbar machen.",
    mentalModel:
      "Die Iteration sieht einen Snapshot. Mutation landet in Queues und wird nur an klaren Flush-Grenzen atomar übernommen.",
    repositoryImplementation:
      "Verarbeitet gepufferte Mutationen ohne wiederholte Adds oder geteilte Konstruktor-Arrays. Entfernen erfolgt wertbasiert für alle Treffer. Nebenläufige Threads und Isolation verschachtelter Iterationen werden nicht zugesagt.",
    flow: [
      "Add und Remove in getrennten Pending-Strukturen sammeln.",
      "Vor Iteration einen Flush durchführen und beide Queues leeren.",
      "Über einen stabilen Snapshot iterieren.",
      "Währenddessen gesammelte Änderungen erst nach der Schleife übernehmen.",
    ],
    api: [
      {
        name: "SafeArray.add / remove",
        description: "Stellt Werte in Mutationsqueues.",
      },
      {
        name: "forEach",
        description: "Flusht, iteriert und verarbeitet Removals noch einmal.",
      },
      {
        name: "filter",
        description: "Baut ein neues Array über SafeArray.forEach.",
      },
      {
        name: "length / isEmpty",
        description:
          "Berechnet Werte aus Basisarray und Queues, gegenwärtig durch Add-Duplikate falsch.",
      },
    ],
    build: {
      intro:
        "Definiere zuerst, ob Änderungen aus Callback N noch im selben oder erst im nächsten Durchlauf sichtbar werden.",
      steps: [
        "Konstruktorinput kopieren und Pending-Adds sowie Remove-Set anlegen.",
        "Flush übernimmt jede Queue genau einmal und leert sie sofort.",
        "Iteration arbeitet auf einer Kopie oder einem unveränderten Basispuffer.",
      ],
      code: String.raw`class DeferredList<T> {
  private values: T[] = [];
  private adds: T[] = [];
  private removes = new Set<T>();

  add(value: T) { this.adds.push(value); }
  remove(value: T) { this.removes.add(value); }
  flush() {
    this.values = this.values.filter(value => !this.removes.has(value));
    this.values.push(...this.adds);
    this.removes.clear();
    this.adds = [];
  }
}`,
    },
    tests: [
      "Ein Add erscheint nach beliebig vielen Flushes genau einmal.",
      "Remove während Iteration folgt der dokumentierten Sichtbarkeitsregel.",
      "Add und Remove desselben Objekts in einem Zyklus haben eine festgelegte Reihenfolge.",
    ],
    tradeoffs: [
      "Snapshots sind klar und erzeugen O(n)-Kopien.",
      "Referenzgleichheit genügt für Objekte nur bei stabiler Identität.",
      "Deferred Mutation schützt Iterationen, verzögert aber sichtbare Zustandsänderungen.",
    ],
    note: "Entfernen erfolgt wertbasiert für alle Treffer. Nebenläufige Threads und Isolation verschachtelter Iterationen werden nicht zugesagt.",
    source: "packages/safe-array/src",
    related: ["better-set", "reactivity"],
  },
  {
    slug: "signature",
    title: "Signature",
    packageName: "@ralphschuler/signature",
    category: "network",
    maturity: "prototype",
    featured: false,
    tags: ["WebCrypto", "RSA-PSS", "key rotation"],
    summary:
      "Signiert JSON-Umschläge mit RSA-SHA256 und verschlüsselt Schlüsselexporte per AES-GCM.",
    problem:
      "Empfänger müssen Integrität und Herkunft einer Nachricht prüfen können, ohne Zugriff auf den privaten Schlüssel zu besitzen.",
    mentalModel:
      "Header plus Payload werden kanonisch serialisiert und mit Private Key signiert; Key-ID wählt beim Prüfen den passenden Public Key.",
    repositoryImplementation:
      "Signiert JSON-Umschläge mit RSA-SHA256 und verschlüsselt Schlüsselexporte per AES-GCM. Schlüssel gehören lokal zum Signer. Produktiver Vertrauensaufbau, kanonische Serialisierung und Rotation benötigen ein Anwendungsdesign.",
    flow: [
      "Keypair über eine explizite async Factory erzeugen oder laden.",
      "Versionierten Header und Payload kanonisch in Bytes wandeln.",
      "Bytes mit dem privaten Signaturschlüssel signieren.",
      "Key-ID auflösen, Timestamp-Policy prüfen und dieselben Bytes verifizieren.",
      "Private Keys versioniert und authentifiziert verschlüsselt persistieren.",
    ],
    api: [
      {
        name: "Signature<T>",
        description: "High-Level-Fassade mit drei rotierenden RSA-Keypairs.",
      },
      {
        name: "PayloadSigner<T>",
        description:
          "Erstellt Header und signiert/verifiziert serialisierte Daten.",
      },
      {
        name: "KeyPairEncryption",
        description:
          "Exportiert Keys und verschlüsselt Private-Key-Material per PBKDF2/AES-CBC.",
      },
      {
        name: "KeyPairManager (intern)",
        description:
          "Erzeugt, rotiert und findet Keys, wird aber nicht am Root exportiert.",
      },
    ],
    build: {
      intro:
        "Beginne mit einer awaitbaren Factory und einem festen Signaturalgorithmus; Persistenz ist ein separater Schritt.",
      steps: [
        "Keypair vollständig erzeugen, bevor eine Signer-Instanz zurückgegeben wird.",
        "Header und Payload in ein kanonisches, versioniertes Byteformat bringen.",
        "Private-Key-Export mit eigener KDF-Salt und AES-GCM-IV als Base64url speichern.",
      ],
      code: String.raw`async function sign(payload: unknown, privateKey: CryptoKey) {
  const bytes = new TextEncoder().encode(canonicalJson(payload));
  const signature = await crypto.subtle.sign(
    { name: "RSA-PSS", saltLength: 32 },
    privateKey,
    bytes,
  );
  return new Uint8Array(signature);
}

async function verify(payload: unknown, value: BufferSource, publicKey: CryptoKey) {
  const bytes = new TextEncoder().encode(canonicalJson(payload));
  return crypto.subtle.verify({ name: "RSA-PSS", saltLength: 32 }, publicKey, value, bytes);
}`,
    },
    tests: [
      "Originalpayload verifiziert; veränderter Header, Payload oder Signatur verifiziert nicht.",
      "Signieren ist vor abgeschlossener Keyinitialisierung durch die API unmöglich.",
      "Export/Encrypt/Serialize/Parse/Decrypt/Import bildet den privaten Key verlustfrei ab und erkennt Manipulation.",
    ],
    tradeoffs: [
      "RSA-PSS ist breit verfügbar, aber Key und Signatur sind groß.",
      "Kanonische Serialisierung ist zusätzlicher Aufwand und unverzichtbar für reproduzierbare Bytes.",
      "Keyrotation begrenzt Schäden, erfordert aber Historie, Ablauf und Revocation.",
    ],
    note: "Schlüssel gehören lokal zum Signer. Produktiver Vertrauensaufbau, kanonische Serialisierung und Rotation benötigen ein Anwendungsdesign.",
    source: "packages/signature/src",
    related: ["p2p", "proof-of-work"],
  },
  {
    slug: "slot-mashine",
    title: "Slot Mashine",
    packageName: "@ralphschuler/slot-mashine",
    category: "simulation",
    maturity: "prototype",
    featured: false,
    tags: ["weighted random", "paylines", "simulation"],
    summary:
      "Simuliert gewichtete Walzen, horizontale und diagonale Gewinne, Credits und Freispiele.",
    problem:
      "Eine reproduzierbare Spielsimulation muss Zufallsverteilung und Auszahlung unabhängig modellieren und jede sichtbare Linie korrekt auswerten.",
    mentalModel:
      "Reels erzeugen Spalten eines Rasters. Paylines sind explizite Koordinatenfolgen; ein reiner Evaluator berechnet daraus einen Gewinn.",
    repositoryImplementation:
      "Simuliert gewichtete Walzen, horizontale und diagonale Gewinne, Credits und Freispiele. Die Engine ist eine didaktische deterministische Simulation. UI, Echtgeldbuchhaltung und regulatorische Anforderungen liegen außerhalb ihres Vertrags.",
    flow: [
      "Symbole mit getrenntem weight und payout definieren.",
      "Pro Reel und sichtbarer Zeile über injizierten RNG ziehen.",
      "Explizite Payline-Koordinaten inklusive Wild-Regeln auswerten.",
      "Scatter/Freispiele und Gewinn atomisch auf Integer-Credits buchen.",
      "Engineergebnis separat rendern oder über eine CLI bedienen.",
    ],
    api: [
      {
        name: "FruitSlotMachine (intern)",
        description:
          "Kombiniert Engine, Credits, Freispielzustand, Rendering und readline-Loop.",
      },
      {
        name: "Reel / FruitReel (intern)",
        description: "Zieht drei Symbole aus einer aufgebauten Symbolmenge.",
      },
      {
        name: "BaseSymbol / WildSymbol / ScatterSymbol (intern)",
        description: "Symbolklassen mit Multiplikator und Darstellung.",
      },
    ],
    build: {
      intro:
        "Die Kernengine sollte rein und deterministisch sein; Zufall und UI werden injiziert.",
      steps: [
        "Gewichte, Auszahlungen und Symbole als Daten statt Vererbung definieren.",
        "Raster mit einem seedbaren RNG erzeugen.",
        "Paylines als Koordinatenarrays ohne Console- oder Guthabenseiteneffekt auswerten.",
      ],
      code: String.raw`type Weighted<T> = { value: T; weight: number };

function pick<T>(items: Weighted<T>[], random: () => number) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let cursor = random() * total;
  for (const item of items) {
    cursor -= item.weight;
    if (cursor < 0) return item.value;
  }
  throw new Error("No selectable symbol");
}

const middleLine = [[0, 1], [1, 1], [2, 1]] as const;`,
    },
    tests: [
      "Grenzwerte der Gewichtsintervalle wählen das erwartete Symbol.",
      "Jede horizontale und diagonale Payline liest die richtigen Rasterkoordinaten.",
      "Negative, unendliche und zu große Einsätze verändern Credits nicht.",
    ],
    tradeoffs: [
      "Reproduzierbarer RNG erleichtert Tests, ist bei echtem Glücksspiel regulatorisch unzureichend.",
      "Mehr Paylines erhöhen Variation und Auszahlungswahrscheinlichkeit.",
      "Geld als Integer-Cents verhindert Gleitkommafehler.",
    ],
    note: "Die Engine ist eine didaktische deterministische Simulation. UI, Echtgeldbuchhaltung und regulatorische Anforderungen liegen außerhalb ihres Vertrags.",
    source: "packages/slot-mashine/src",
    related: ["random", "stats-tracker"],
  },
  {
    slug: "state-machine",
    title: "State Machine",
    packageName: "@ralphschuler/state-machine",
    category: "state",
    maturity: "partial",
    featured: true,
    tags: ["FSM", "guards", "transitions"],
    summary:
      "Serialisiert Übergänge, wartet Guards ab und betritt den korrekten Zielzustand.",
    problem:
      "Wenn Statuswechsel über viele if-Zweige verteilt sind, entstehen unmögliche Zustände, versteckte Seiteneffekte und schwer reproduzierbare Fehler.",
    mentalModel:
      "Eine endliche Zustandsmaschine liest das Paar aus aktuellem Zustand und Ereignis, prüft optional einen Guard und wechselt genau einmal zum Zielzustand.",
    repositoryImplementation:
      "Serialisiert Übergänge, wartet Guards ab und betritt den korrekten Zielzustand. Aktionen können externe Effekte haben. Rekursiv ausgelöste Events innerhalb einer aktiven Aktion nicht abwarten; Folgeereignisse nach ihrem Ende einplanen.",
    flow: [
      "Aktuellen Zustand und Ereignis gegen die Transitionstabelle auflösen.",
      "Optionalen Guard vollständig abwarten und bei false ohne Änderung zurückkehren.",
      "Exit-Aktion ausführen, Zielzustand atomisch setzen und Entry-Aktion starten.",
      "Beobachter nach erfolgreichem Wechsel mit Vorher/Nachher-Daten benachrichtigen.",
      "Gleichzeitige Ereignisse über eine Queue serialisieren.",
    ],
    api: [
      {
        name: "StateMachine",
        description:
          "Verwaltet Zustand, Transitionen und State-Change-Observer.",
      },
      {
        name: "addTransition",
        description: "Registriert Ereignis, Ziel, Guard und optionale Aktion.",
      },
      {
        name: "transition",
        description: "Versucht einen Zustandswechsel für ein Ereignis.",
      },
      {
        name: "subscribe",
        description: "Beobachtet erfolgreiche Zustandswechsel.",
      },
    ],
    build: {
      intro:
        "Für den Kern reichen eine typisierte Tabelle und eine einzige asynchrone send-Methode.",
      steps: [
        "Zustände und Ereignisse als String-Unions definieren.",
        "Transitionen je Zustand und Ereignis in einer Tabelle ablegen.",
        "Guard abwarten und erst danach den Zustand in einem Schritt aktualisieren.",
      ],
      code: String.raw`type Transition<S, P> = {
  target: S;
  guard?: (payload: P) => boolean | Promise<boolean>;
};

class Machine<S extends string, E extends string, P> {
  constructor(
    private state: S,
    private table: Record<S, Partial<Record<E, Transition<S, P>>>>,
  ) {}

  async send(event: E, payload: P) {
    const next = this.table[this.state][event];
    if (!next || (next.guard && !(await next.guard(payload)))) return this.state;
    this.state = next.target;
    return this.state;
  }
}`,
    },
    tests: [
      "Unbekannte Ereignisse lassen den Zustand unverändert.",
      "Synchrone und asynchrone Guards blockieren oder erlauben dieselbe Transition korrekt.",
      "Parallel gesendete Ereignisse werden in definierter Reihenfolge verarbeitet.",
    ],
    tradeoffs: [
      "Explizite Tabellen machen Verhalten sichtbar, werden bei vielen orthogonalen Zuständen aber groß.",
      "Asynchrone Aktionen sind praktisch, brauchen jedoch eine klare Queue- und Fehlerstrategie.",
      "Historie und Persistenz gehören als Adapter um den kleinen Kern, nicht in jede Transition.",
    ],
    note: "Aktionen können externe Effekte haben. Rekursiv ausgelöste Events innerhalb einer aktiven Aktion nicht abwarten; Folgeereignisse nach ihrem Ende einplanen.",
    source: "packages/state-machine/src",
    related: ["state-store", "reactivity"],
  },
  {
    slug: "state-store",
    title: "State Store",
    packageName: "@ralphschuler/state-store",
    category: "state",
    maturity: "prototype",
    featured: false,
    tags: ["store", "proxy", "subscriptions"],
    summary:
      "Besitzt eigene Zustandskopien mit expliziten Updates und abmeldbaren Subscriptions.",
    problem:
      "Direkt geteilter Objektzustand verrät nicht, wer ihn wann verändert hat, und koppelt Leser, Schreiber sowie Seiteneffekte eng aneinander.",
    mentalModel:
      "Ein Store besitzt den Zustand. Schreiboperationen erzeugen eine neue Version und informieren nur Abonnenten des geänderten Schlüssels.",
    repositoryImplementation:
      "Besitzt eigene Zustandskopien mit expliziten Updates und abmeldbaren Subscriptions. Werte müssen per structuredClone kopierbar sein. Verschachtelte Änderungen benötigen set; reservierte Proxy-Namen dürfen keine State-Schlüssel sein.",
    flow: [
      "Initialzustand defensiv kopieren und nur über eine kleine Store-API zugänglich machen.",
      "Bei set alten und neuen Wert vergleichen und den Zustand aktualisieren.",
      "Passende Listener mit Wert, Vorwert und Schlüssel benachrichtigen.",
      "Eine unsubscribe-Funktion zurückgeben und Listener beim Aufräumen entfernen.",
    ],
    api: [
      {
        name: "StateStore",
        description:
          "Experimentelle Store-Klasse mit Proxy-basierter Oberfläche.",
      },
      {
        name: "createStateStore",
        description: "Erzeugt einen Store aus typisiertem Initialzustand.",
      },
      {
        name: "Middleware / Interceptor",
        description:
          "Typen für Transformation und Beobachtung von Schreibzugriffen.",
      },
    ],
    build: {
      intro:
        "Eine explizite API ist leichter zu verstehen und zu testen als magische Proxy-Semantik.",
      steps: [
        "Zustand privat halten und Werte über get auslesen.",
        "Schreibzugriffe in set bündeln und unveränderte Werte überspringen.",
        "Subscriptions in Sets verwalten und immer eine unsubscribe-Funktion liefern.",
      ],
      code: String.raw`class Store<S extends object> {
  private listeners = new Set<(state: Readonly<S>) => void>();

  constructor(private state: S) {}
  get() { return this.state as Readonly<S>; }
  set(update: Partial<S>) {
    this.state = { ...this.state, ...update };
    for (const listener of this.listeners) listener(this.state);
  }
  subscribe(listener: (state: Readonly<S>) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}`,
    },
    tests: [
      "set behält unberührte Schlüssel und veröffentlicht den neuen Snapshot.",
      "unsubscribe verhindert alle späteren Benachrichtigungen.",
      "Ein Listener darf sich während einer Benachrichtigung sicher abmelden.",
    ],
    tradeoffs: [
      "Snapshots sind nachvollziehbar, kopieren bei großen Objekten jedoch mehr Daten.",
      "Schlüsselbezogene Listener sparen Arbeit, vergrößern aber die API.",
      "Proxies wirken bequem, erschweren Debugging und kollidieren leicht mit Store-Methoden.",
    ],
    note: "Werte müssen per structuredClone kopierbar sein. Verschachtelte Änderungen benötigen set; reservierte Proxy-Namen dürfen keine State-Schlüssel sein.",
    source: "packages/state-store/src",
    related: ["reactivity", "state-machine"],
  },
  {
    slug: "stats-tracker",
    title: "Stats Tracker",
    packageName: "@ralphschuler/stats-tracker",
    category: "observability",
    maturity: "prototype",
    featured: false,
    tags: ["events", "sliding window", "metrics"],
    summary:
      "Misst Ereigniszahlen im gleitenden Fenster mit austauschbarer monotoner Uhr.",
    problem:
      "Ein Gesamtzähler sagt nicht, ob Aktivität gerade stattfindet; für Raten und Bursts braucht man Werte in einem definierten Zeitfenster.",
    mentalModel:
      "Jedes Ereignis erhält einen Zeitstempel. Beim Lesen werden abgelaufene Einträge entfernt und die verbleibenden Einträge gezählt.",
    repositoryImplementation:
      "Misst Ereigniszahlen im gleitenden Fenster mit austauschbarer monotoner Uhr. Zähler betreffen das konfigurierte Fenster, nicht die gesamte Historie. Speicherbedarf wächst mit den Ereignissen im Fenster.",
    flow: [
      "Ereignisname und aktuellen Zeitpunkt erfassen.",
      "Zeitstempel in den Bucket des Ereignisses einfügen.",
      "Beim Schreiben und Lesen alle Werte vor der Fenstergrenze entfernen.",
      "Anzahl oder Rate aus dem verbleibenden Bucket ableiten.",
    ],
    api: [
      {
        name: "log",
        description: "Erfasst ein Ereignis mit dem aktuellen Timestamp.",
      },
      {
        name: "getCount",
        description: "Liest den aktuellen Wert aus dem 60-Sekunden-Fenster.",
      },
      {
        name: "EventPayloadMap (intern)",
        description: "Bindet bekannte Eventnamen an Payloadtypen.",
      },
    ],
    build: {
      intro:
        "Mit injizierter Uhr bleibt ein gleitender Zähler klein und vollständig deterministisch testbar.",
      steps: [
        "Fensterlänge und now-Funktion beim Erzeugen entgegennehmen.",
        "Zeitstempel geordnet pro Ereignis speichern.",
        "Vor jeder Auswertung Einträge links bis zur Fenstergrenze entfernen.",
      ],
      code: String.raw`class WindowCounter {
  private points: number[] = [];
  constructor(private windowMs: number, private now = Date.now) {}
  add() { this.points.push(this.now()); }
  count() {
    const cutoff = this.now() - this.windowMs;
    while (this.points[0] < cutoff) this.points.shift();
    return this.points.length;
  }
}`,
    },
    tests: [
      "Einträge genau an der Fenstergrenze folgen der dokumentierten inklusiv/exklusiv-Regel.",
      "Eine vorgerückte Fake-Uhr entfernt abgelaufene Einträge auch ohne neues Ereignis.",
      "Getrennte Ereignisbuckets beeinflussen einander nicht.",
    ],
    tradeoffs: [
      "Timestamp-Listen sind exakt, benötigen bei hohem Volumen jedoch viel Speicher.",
      "Zeit-Buckets sparen Speicher und liefern dafür nur angenäherte Grenzen.",
      "Lazy Cleanup vermeidet Timer, verlagert die Arbeit aber auf Lesezugriffe.",
    ],
    note: "Zähler betreffen das konfigurierte Fenster, nicht die gesamte Historie. Speicherbedarf wächst mit den Ereignissen im Fenster.",
    source: "packages/stats-tracker/src",
    related: ["prom-metrics-decorator", "prom-metrics-parser"],
  },
  {
    slug: "swarm",
    title: "Swarm",
    packageName: "@ralphschuler/swarm",
    category: "network",
    maturity: "stub",
    featured: false,
    tags: ["workers", "broadcast", "coordination"],
    summary:
      "Sendet an eine begrenzte Gruppe eindeutiger lokaler Worker und erhält Teilerfolge.",
    problem:
      "Mehrere verteilte Worker benötigen Identität, Transport, Lebenszyklus und definierte Regeln für Broadcast, Fehler sowie Teilantworten.",
    mentalModel:
      "Der Manager kennt aktive Knoten und delegiert Bytes über einen Transport. Ein Protokoll beschreibt Handshake, Anfrage-ID, Antwort und Timeout.",
    repositoryImplementation:
      "Sendet an eine begrenzte Gruppe eindeutiger lokaler Worker und erhält Teilerfolge. Der geprüfte Kern ist lokale Orchestrierung. Remote-Ausführung, Authentifizierung, Wiederholungen und Heartbeats benötigen einen Netzwerkadapter.",
    flow: [
      "Worker über einen Transport verbinden und per Handshake identifizieren.",
      "Nachrichten mit Version, Anfrage-ID und Deadline serialisieren.",
      "Broadcast parallel an einen stabilen Snapshot aktiver Worker senden.",
      "Ergebnisse, Timeouts und Transportfehler pro Worker getrennt zurückgeben.",
    ],
    api: [
      {
        name: "Manager",
        description: "Unvollständige Hülle für Worker-Liste und Broadcast.",
      },
      {
        name: "ManagerParams",
        description: "Noch leere Konfiguration des Managers.",
      },
      {
        name: "Worker / Handshake",
        description: "Platzhalter ohne implementiertes Protokoll.",
      },
    ],
    build: {
      intro:
        "Definiere zuerst einen transportneutralen Vertrag; Netzwerk- oder Worker-Adapter kommen danach.",
      steps: [
        "Knoten mit stabiler ID und send-Methode modellieren.",
        "Beim Broadcast die aktuelle Map kopieren, damit Verbindungen parallel wechseln dürfen.",
        "Promise.allSettled verwenden und Teilerfolge sichtbar zurückgeben.",
      ],
      code: String.raw`type Node = { id: string; send(message: Uint8Array): Promise<Uint8Array> };

class Swarm {
  private nodes = new Map<string, Node>();
  connect(node: Node) { this.nodes.set(node.id, node); }
  disconnect(id: string) { this.nodes.delete(id); }
  broadcast(message: Uint8Array) {
    return Promise.allSettled(
      [...this.nodes.values()].map((node) => node.send(message)),
    );
  }
}`,
    },
    tests: [
      "Ein Broadcast erreicht genau den Snapshot der beim Start verbundenen Worker.",
      "Ein fehlerhafter Worker verwirft erfolgreiche Antworten anderer Worker nicht.",
      "Doppelte IDs, Timeout und Disconnect während einer Anfrage sind definiert.",
    ],
    tradeoffs: [
      "Broadcast ist einfach, vervielfacht aber Last und Datenverkehr linear.",
      "Teilergebnisse erhöhen Verfügbarkeit, zwingen Aufrufer jedoch zu Fehlerpolitik.",
      "Transportneutralität erleichtert Tests und braucht dafür ein explizites Wire-Protokoll.",
    ],
    note: "Der geprüfte Kern ist lokale Orchestrierung. Remote-Ausführung, Authentifizierung, Wiederholungen und Heartbeats benötigen einen Netzwerkadapter.",
    source: "packages/swarm/src",
    related: ["worker-pool", "state-machine"],
  },
  {
    slug: "task-manager",
    title: "Task Manager",
    packageName: "@ralphschuler/task-manager",
    category: "state",
    maturity: "prototype",
    featured: false,
    tags: ["queue", "concurrency", "scheduling"],
    summary:
      "Plant priorisierte asynchrone Tasks innerhalb einer festen Parallelitätsgrenze.",
    problem:
      "Unbegrenztes paralleles Starten überlastet CPU, Netzwerk oder Fremdsysteme; eine Queue muss Fairness, Resultate, Abbruch und Shutdown definieren.",
    mentalModel:
      "Aufgaben warten in einer Queue. Jeder freie Slot nimmt genau eine Aufgabe, gibt ihr Ergebnis zurück und startet danach den nächsten Eintrag.",
    repositoryImplementation:
      "Plant priorisierte asynchrone Tasks innerhalb einer festen Parallelitätsgrenze. Shutdown weist wartende Arbeit zurück und lässt aktive Tasks enden. CPU-Isolation und persistente Queues sind separate Aufgaben.",
    flow: [
      "Aufgabe mit resolve/reject in die Warteschlange legen.",
      "Solange Slots frei sind, den nächsten Eintrag starten.",
      "Resultat oder Fehler an den ursprünglichen Aufrufer weiterreichen.",
      "Slot im finally freigeben und sofort die nächste Aufgabe pumpen.",
      "Beim Shutdown neue Aufgaben ablehnen und Wartende definiert beenden.",
    ],
    api: [
      {
        name: "TaskManager",
        description:
          "Experimenteller Scheduler auf PriorityQueue und WorkerPool.",
      },
      {
        name: "addTask",
        description:
          "Soll eine Aufgabe einreihen und ihr Resultat zurückliefern.",
      },
      {
        name: "destroy",
        description:
          "Stoppt Verarbeitung, behandelt wartende Aufgaben derzeit aber unvollständig.",
      },
    ],
    build: {
      intro:
        "Ein begrenzter Promise-Scheduler zeigt das Prinzip ohne Polling und ohne echte Worker.",
      steps: [
        "Wartende Starts als Funktionen in einer FIFO-Queue speichern.",
        "Aktive Anzahl vor dem Start erhöhen und in finally verringern.",
        "pump nach enqueue und nach jeder Fertigstellung aufrufen.",
      ],
      code: String.raw`class TaskQueue {
  private active = 0;
  private waiting: Array<() => void> = [];
  constructor(private limit: number) {}

  run<T>(task: () => Promise<T>) {
    return new Promise<T>((resolve, reject) => {
      this.waiting.push(() => {
        this.active++;
        task().then(resolve, reject).finally(() => { this.active--; this.pump(); });
      });
      this.pump();
    });
  }
  private pump() {
    while (this.active < this.limit && this.waiting.length) this.waiting.shift()?.();
  }
}`,
    },
    tests: [
      "Nie laufen mehr Aufgaben als das konfigurierte Limit gleichzeitig.",
      "Erfolg, Throw und Promise-Rejection geben den Slot in allen Fällen frei.",
      "Shutdown entscheidet für jede wartende Aufgabe mit einem dokumentierten Fehler.",
    ],
    tradeoffs: [
      "FIFO ist fair und kennt ohne Zusatzstruktur keine Prioritäten.",
      "Promise-Concurrency begrenzt I/O, verschiebt CPU-Arbeit aber nicht in einen anderen Thread.",
      "Abbruch benötigt ein Signal, das sowohl Queue als auch laufende Aufgabe verstehen.",
    ],
    note: "Shutdown weist wartende Arbeit zurück und lässt aktive Tasks enden. CPU-Isolation und persistente Queues sind separate Aufgaben.",
    source: "packages/task-manager/src",
    related: ["worker-pool", "priority-queue"],
  },
  {
    slug: "ts-error",
    title: "TS Error",
    packageName: "@ralphschuler/ts-error",
    category: "foundations",
    maturity: "partial",
    featured: false,
    tags: ["errors", "result", "normalization"],
    summary:
      "Fängt Fehler und normalisiert problematische, zyklische oder asynchrone Fehlerwerte sicher.",
    problem:
      "JavaScript darf beliebige Werte werfen; Grenzen zwischen Bibliotheken, Workern oder JSON verlieren dadurch Namen, Ursache und zuverlässige Typen.",
    mentalModel:
      "Am Systemrand wird unknown einmal in eine serialisierbare Fehlerform überführt. Intern transportiert ein discriminated union Erfolg oder Fehler explizit.",
    repositoryImplementation:
      "Fängt Fehler und normalisiert problematische, zyklische oder asynchrone Fehlerwerte sicher. Das kompatible Ergebnisformat lässt Error als regulären Rückgabewert mehrdeutig. Ein markierter Result-Typ ist eine mögliche spätere Hauptversion.",
    flow: [
      "Synchronen Aufruf oder Promise in try/catch beziehungsweise await einschließen.",
      "Gefangenen unknown-Wert ohne weitere Throws in eine sichere Struktur umwandeln.",
      "Erfolg und Fehler über ein eindeutiges ok-Feld unterscheiden.",
      "An Prozessgrenzen nur JSON-sichere Felder übertragen und Ursachen begrenzen.",
    ],
    api: [
      {
        name: "NormalizedError",
        description:
          "Einheitliche Error-Unterklasse für unbekannte Fehlerwerte.",
      },
      {
        name: "noThrow",
        description:
          "Wandelt synchrones oder asynchrones Werfen in ein Result um.",
      },
      {
        name: "toNormalizedError / isError",
        description: "Normalisiert unknown und erkennt Error-artige Werte.",
      },
      {
        name: "aggregateErrors",
        description:
          "Fasst mehrere Fehler zu einer gemeinsamen Meldung zusammen.",
      },
    ],
    build: {
      intro:
        "Ein explizites Result vermeidet die Mehrdeutigkeit zwischen Rückgabewert und Fehler.",
      steps: [
        "Result als Union mit ok: true oder ok: false definieren.",
        "unknown über instanceof und sichere String-Konvertierung normalisieren.",
        "Async-Aufrufe immer mit await im selben try-Block ausführen.",
      ],
      code: String.raw`type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: { name: string; message: string; stack?: string } };

async function capture<T>(run: () => T | PromiseLike<T>): Promise<Result<T>> {
  try { return { ok: true, value: await run() }; }
  catch (value) {
    const error = value instanceof Error ? value : new Error(String(value));
    return { ok: false, error: { name: error.name, message: error.message, stack: error.stack } };
  }
}`,
    },
    tests: [
      "Error, String, null und ein Objekt mit werfender toString-Methode werden ohne Folgefehler normalisiert.",
      "Thenables und native Promises liefern dieselbe Result-Form.",
      "Ein regulär zurückgegebener Error bleibt durch ok: true eindeutig ein Wert.",
    ],
    tradeoffs: [
      "Result macht Fehler im Typ sichtbar, erfordert aber explizites Branching an jedem Aufruf.",
      "Stacks helfen beim Debugging, können jedoch Pfade oder andere interne Daten verraten.",
      "Serialisierbare Fehler verlieren Prototyp und nicht standardisierte Eigenschaften.",
    ],
    note: "Das kompatible Ergebnisformat lässt Error als regulären Rückgabewert mehrdeutig. Ein markierter Result-Typ ist eine mögliche spätere Hauptversion.",
    source: "packages/ts-error/src",
    related: ["functional", "assert"],
  },
  {
    slug: "webgl-sand-engine",
    title: "WebGL Sand Engine",
    packageName: "@ralphschuler/webgl-sand-engine",
    category: "simulation",
    maturity: "stub",
    featured: false,
    tags: ["cellular automata", "grid", "WebGL"],
    summary:
      "Führt eine deterministische CPU-Sandreferenz und begrenzte Nachbarschaftsabfragen aus.",
    problem:
      "Sand, Wasser und Hindernisse benötigen lokale Nachbarschaftsregeln, deterministische Updates und eine effiziente Darstellung vieler Rasterzellen.",
    mentalModel:
      "Jede Zelle enthält einen Materialcode. Ein Simulationsschritt liest den alten Buffer und schreibt Entscheidungen in einen zweiten Buffer; Rendering ist davon getrennt.",
    repositoryImplementation:
      "Führt eine deterministische CPU-Sandreferenz und begrenzte Nachbarschaftsabfragen aus. Der geprüfte Kern erhält Partikel und nutzt Snapshot-Updates. Vollständige WebGL-Simulation, Wasser und Chunk-Synchronisation bleiben spätere Integrationen.",
    flow: [
      "Raster als flachen typisierten Buffer mit Breite und Höhe anlegen.",
      "Für jede aktive Zelle gültige Nachbarn aus dem alten Zustand lesen.",
      "Materialregel anwenden und Ergebnis konfliktfrei in den nächsten Buffer schreiben.",
      "Buffer tauschen und den neuen Zustand separat rendern.",
    ],
    api: [
      {
        name: "Pixel / Material Interfaces",
        description:
          "Unvollständige Datentypen für Zellen und Materialverhalten.",
      },
      {
        name: "NeighborProvider",
        description: "Platzhalter für Nachbarschaftsabfragen.",
      },
      {
        name: "pixel-renderer",
        description:
          "Teilweiser WebGL-Renderer ohne vollständige Engineintegration.",
      },
    ],
    build: {
      intro:
        "Starte auf der CPU mit einer einzigen Sandregel; danach kann derselbe Zustandsvertrag auf die GPU wandern.",
      steps: [
        "Leere Zelle und Sand als numerische Codes festlegen.",
        "Von unten nach oben arbeiten, damit ein Korn pro Tick höchstens einmal fällt.",
        "Grenzen prüfen und für komplexere Regeln einen zweiten Buffer einführen.",
      ],
      code: String.raw`const EMPTY = 0, SAND = 1;
function stepSand(grid: Uint8Array, width: number, height: number) {
  const next = grid.slice();
  for (let y = height - 2; y >= 0; y--) for (let x = 0; x < width; x++) {
    const from = y * width + x, below = from + width;
    if (grid[from] === SAND && grid[below] === EMPTY) {
      next[from] = EMPTY; next[below] = SAND;
    }
  }
  return next;
}`,
    },
    tests: [
      "Ein Korn fällt genau eine Zelle und verlässt niemals den Rasterrand.",
      "Blockierter Sand bleibt stehen; Eingabebuffer wird nicht verändert.",
      "Mehrere Körner erzeugen unabhängig von Iterationsdetails ein dokumentiertes Ergebnis.",
    ],
    tradeoffs: [
      "CPU-Regeln sind leicht zu debuggen, skalieren aber schlechter als parallele Shader.",
      "Double Buffering vermeidet Lese-/Schreibkonflikte und verdoppelt den Zustandsbedarf.",
      "Zufällige Diagonalwahl wirkt natürlich, erschwert ohne seedbaren RNG die Reproduktion.",
    ],
    note: "Der geprüfte Kern erhält Partikel und nutzt Snapshot-Updates. Vollständige WebGL-Simulation, Wasser und Chunk-Synchronisation bleiben spätere Integrationen.",
    source: "packages/webgl-sand-engine/src",
    related: ["webgl-shader-factory", "random"],
  },
  {
    slug: "webgl-shader-factory",
    title: "WebGL Shader Factory",
    packageName: "@ralphschuler/webgl-shader-factory",
    category: "simulation",
    maturity: "partial",
    featured: false,
    tags: ["WebGL", "GLSL", "resource lifecycle"],
    summary:
      "Verwaltet Shader-Kompilierung, Linking, benötigte Locations und idempotente Freigabe.",
    problem:
      "WebGL liefert Kompilier- und Linkfehler erst zur Laufzeit; Boilerplate und vergessene Ressourcenfreigabe machen Shader-Setup fehleranfällig.",
    mentalModel:
      "Vertex- und Fragmentshader werden separat kompiliert, zu einem Programm gelinkt, validiert und mit explizitem dispose-Lebenszyklus zurückgegeben.",
    repositoryImplementation:
      "Verwaltet Shader-Kompilierung, Linking, benötigte Locations und idempotente Freigabe. Unit-Tests verwenden einen deterministischen WebGL-Mock. Browserspezifische Treiber und Context-Wiederherstellung benötigen Integrationstests.",
    flow: [
      "Shader je Stufe erzeugen, Source setzen, kompilieren und Status prüfen.",
      "Nur erfolgreiche Shader an ein Programm hängen und Linkstatus validieren.",
      "Angeforderte Locations auflösen und fehlende Pflichtwerte als Fehler melden.",
      "Shader nach dem Linken löschen und das Programm beim dispose freigeben.",
    ],
    api: [
      {
        name: "createShader",
        description:
          "Kompiliert GLSL und liefert eine wiederverwendbare Programmhülle.",
      },
      {
        name: "uniforms / attributes",
        description: "Typisierte Maps der angeforderten WebGL-Locations.",
      },
      {
        name: "use",
        description: "Aktiviert das gelinkte Programm im aktuellen Context.",
      },
    ],
    build: {
      intro:
        "Eine kleine Compile-Funktion braucht vor allem vollständige Fehlerpfade und Resource Cleanup.",
      steps: [
        "Shader erzeugen und bei fehlender Allokation sofort abbrechen.",
        "Compile-Status prüfen und Log vor dem Löschen sichern.",
        "Auch bei späterem Linkfehler jeden bereits erzeugten Shader freigeben.",
      ],
      code: String.raw`function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Shader allocation failed");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "Unknown shader error";
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}`,
    },
    tests: [
      "Ungültiges GLSL gibt das Compilerlog zurück und löscht den Shader.",
      "Linkfehler löschen Programm sowie beide kompilierten Shader.",
      "Fehlende verpflichtende Uniforms werden vor dem ersten Frame erkannt.",
    ],
    tradeoffs: [
      "Strikte Location-Prüfung erkennt Tippfehler früh, kann aber wegoptimierte Uniforms ablehnen.",
      "Generische Typmaps bieten Komfort, garantieren ohne Laufzeitprüfung keine tatsächliche GLSL-Schnittstelle.",
      "Programmcaching spart Compilezeit und benötigt Context-Verlust- sowie Invalidierungslogik.",
    ],
    note: "Unit-Tests verwenden einen deterministischen WebGL-Mock. Browserspezifische Treiber und Context-Wiederherstellung benötigen Integrationstests.",
    source: "packages/webgl-shader-factory/src",
    related: ["webgl-sand-engine", "random"],
  },
  {
    slug: "worker-pool",
    title: "Worker Pool",
    packageName: "@ralphschuler/worker-pool",
    category: "state",
    maturity: "prototype",
    featured: true,
    tags: ["worker_threads", "parallelism", "backpressure"],
    summary:
      "Führt vertrauenswürdige eigenständige Funktionen auf begrenzten Workern mit Timeout-Erholung aus.",
    problem:
      "CPU-intensive Funktionen blockieren den Event Loop; pro Aufgabe einen neuen Thread zu starten ist jedoch teuer und braucht keine kontrollierte Warteschlange.",
    mentalModel:
      "Der Main Thread sendet nur Daten plus Task-ID. Worker besitzen vorinstallierte Handler, führen einen Auftrag aus und antworten mit Resultat oder serialisiertem Fehler.",
    repositoryImplementation:
      "Führt vertrauenswürdige eigenständige Funktionen auf begrenzten Workern mit Timeout-Erholung aus. Funktionsquellcode kann keine Closures übernehmen und darf nie unvertrauenswürdig sein. Vorinstallierte Handler-Registries und Transferables sind mögliche Erweiterungen.",
    flow: [
      "Worker einmal starten und auf ready warten.",
      "Task-ID, registrierten Handlernamen und klonbare Payload in eine FIFO-Queue legen.",
      "Nur freie Worker belegen und genau eine laufende Task pro Worker zuordnen.",
      "Bei result oder error Promise beenden, Zuordnung löschen und nächsten Auftrag starten.",
      "Bei Exit laufende Task ablehnen und Worker je nach Shutdown-Status ersetzen.",
    ],
    api: [
      {
        name: "WorkerPool",
        description: "Experimenteller Pool auf Node.js worker_threads.",
      },
      {
        name: "runTask",
        description:
          "Soll Arbeit einreihen und das Workerresultat zurückliefern.",
      },
      {
        name: "destroy",
        description:
          "Beendet Worker; Queue- und Promise-Cleanup sind derzeit lückenhaft.",
      },
    ],
    build: {
      intro:
        "Sende keine Funktionen. Der Worker lädt ein festes Registry-Modul und akzeptiert nur Taskname plus strukturklonbare Daten.",
      steps: [
        "Gemeinsames Message-Protokoll mit id, task, payload, result und error definieren.",
        "Worker-seitig erlaubte Handler in einer Registry auflösen.",
        "Manager-seitig pro ID resolve/reject halten und Worker erst nach Antwort freigeben.",
      ],
      code: String.raw`// worker.ts
const handlers = {
  square: (value: number) => value * value,
};
parentPort?.on("message", async ({ id, task, payload }) => {
  try {
    const result = await handlers[task as keyof typeof handlers](payload);
    parentPort?.postMessage({ id, ok: true, result });
  } catch (error) {
    parentPort?.postMessage({ id, ok: false, error: String(error) });
  }
});`,
    },
    tests: [
      "0, false, leerer String und undefined beenden ihre Task ohne Hänger.",
      "Ein Worker verarbeitet niemals zwei Aufgaben gleichzeitig und wird nach Fehler wieder frei.",
      "Crash und destroy lehnen jede betroffene laufende oder wartende Task genau einmal ab.",
    ],
    tradeoffs: [
      "Langlebige Worker amortisieren Startkosten, reservieren aber dauerhaft Speicher.",
      "Eine Handler-Registry ist sicher und serialisierbar, aber weniger dynamisch als Funktionsübergabe.",
      "Große Payloads kosten Structured-Clone-Zeit; Transferables können Kopien vermeiden.",
    ],
    note: "Funktionsquellcode kann keine Closures übernehmen und darf nie unvertrauenswürdig sein. Vorinstallierte Handler-Registries und Transferables sind mögliche Erweiterungen.",
    source: "packages/worker-pool/src",
    related: ["task-manager", "priority-queue"],
  },
];

export const modules = sourceModules.map((module) =>
  applyEvidence(module, "de"),
);
