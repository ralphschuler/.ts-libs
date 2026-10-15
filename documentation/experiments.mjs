// Verified core descriptions and explicit integration limits for every experiment.
// These override historical implementation observations in the concept catalog.
export const evidence = {
  "ai-function-caller": [
    "Runs a bounded, validated function-call conversation with an injectable provider.",
    "Führt eine begrenzte Funktionsschleife mit Argumentprüfung und austauschbarem Provider aus.",
    "Provider calls are mocked in CI; flat schemas are supported. Real provider compatibility and application authorization remain integration concerns.",
    "CI verwendet einen Test-Provider und flache Schemas. Echte Provider-Kompatibilität und fachliche Berechtigungen bleiben Integrationsaufgaben.",
  ],
  assert: [
    "Enforces runtime conditions with matching TypeScript narrowing.",
    "Prüft Laufzeitbedingungen mit dazu passendem TypeScript-Narrowing.",
    "Synchronous assertions throw; nested schemas and asynchronous rejection assertions are separate extensions.",
    "Assertions werfen synchron; verschachtelte Schemas und asynchrone Reject-Prüfungen sind eigene Erweiterungen.",
  ],
  "better-map": [
    "Updates, filters and merges Map entries with explicit missing-value behavior.",
    "Aktualisiert, filtert und vereinigt Map-Einträge mit explizitem Verhalten für fehlende Werte.",
    "Values retain reference identity; callbacks are synchronous and can throw.",
    "Werte behalten ihre Referenzidentität; Callbacks sind synchron und können werfen.",
  ],
  "better-set": [
    "Demonstrates union, intersection and the existing directional difference contract.",
    "Demonstriert Vereinigung, Schnittmenge und den bestehenden gerichteten Differenzvertrag.",
    "except computes argument minus receiver. The direction is retained and regression-tested.",
    "except berechnet Argument minus Empfänger. Die Richtung bleibt erhalten und ist durch Tests festgehalten.",
  ],
  "binary-serializer": [
    "Round-trips fixed-layout unsigned integers, booleans, UTF-8 strings and arrays.",
    "Serialisiert feste Layouts aus vorzeichenlosen Ganzzahlen, Booleans, UTF-8-Strings und Arrays.",
    "This is a versionless fixed-layout format. Schema ordering and migration must be agreed by both endpoints; decorators use the legacy TypeScript contract.",
    "Dies ist ein festes Layout ohne Versionskennung. Schema-Reihenfolge und Migration müssen beide Seiten vereinbaren; Decorators folgen dem Legacy-TypeScript-Vertrag.",
  ],
  "bit-mask": [
    "Manages validated independent feature bits through a public API.",
    "Verwaltet validierte unabhängige Feature-Bits über eine öffentliche API.",
    "Number bitwise operations support positive single bits through bit 30. Wider masks need BigInt.",
    "Number-Bitoperationen unterstützen positive Einzelbits bis Bit 30. Breitere Masken benötigen BigInt.",
  ],
  cli: [
    "Dispatches validated argv commands through awaited middleware.",
    "Verarbeitet validierte argv-Befehle mit abgewarteter Middleware.",
    "Pass argv arrays to preserve shell quoting. Interactive input and shell completion are separate adapters.",
    "argv-Arrays erhalten Shell-Quoting. Interaktive Eingabe und Shell-Completion sind separate Adapter.",
  ],
  "complex-compare": [
    "Computes directional array differences and shallow own-key object changes without global mutation.",
    "Berechnet gerichtete Array-Differenzen und flache Änderungen eigener Objektschlüssel ohne globale Mutation.",
    "Object values are compared by identity; nested structural comparison is deliberately outside the core.",
    "Objektwerte werden per Identität verglichen; tiefer Strukturvergleich liegt außerhalb des Kerns.",
  ],
  functional: [
    "Exports tagged Option and Result values, guards and pattern matching.",
    "Exportiert markierte Option- und Result-Werte, Guards und Pattern Matching.",
    "Wrappers are shallowly frozen; error capture and higher-order combinators are explicit extensions.",
    "Hüllen sind flach eingefroren; Fehlerfang und höhere Kombinatoren bleiben explizite Erweiterungen.",
  ],
  i811n: [
    "Resolves language catalogs and interpolates literal placeholder values.",
    "Löst Sprachkataloge auf und ersetzt Platzhalter durch literale Werte.",
    "No plural-message syntax is implemented. Use Intl for dates, numbers and plural selection.",
    "Eine Pluralnachrichtensyntax ist nicht implementiert. Für Datum, Zahlen und Pluralauswahl eignet sich Intl.",
  ],
  logger: [
    "Formats messages with corrected severity filtering, bounded history and explicit output.",
    "Formatiert Meldungen mit korrigiertem Level-Filter, begrenzter Historie und expliziter Ausgabe.",
    "The singleton is retained for compatibility; direct construction supports isolated tests. Fatal logs do not terminate the process.",
    "Das Singleton bleibt kompatibel; direkte Konstruktion erlaubt isolierte Tests. Fatal-Logs beenden den Prozess nicht.",
  ],
  lsystem: [
    "Rewrites symbol sequences with normalized weights and injectable randomness.",
    "Schreibt Symbolfolgen mit normalisierten Gewichten und austauschbarer Zufallsquelle um.",
    "Output can grow exponentially. Rendering and caller-specific output budgets are separate from grammar rewriting.",
    "Ausgabe kann exponentiell wachsen. Rendering und anwendungsspezifische Ausgabelimits sind von der Grammatik getrennt.",
  ],
  mdns: [
    "Provides a deterministic local discovery model and an explicitly started multicast adapter.",
    "Bietet ein deterministisches lokales Discovery-Modell und einen explizit gestarteten Multicast-Adapter.",
    "MDNS verifies TTL and cleanup locally; NetworkMDNS collects delayed network answers through multicast-dns. CI uses an injected transport; interface selection and cross-machine reliability remain integration work.",
    "MDNS prüft TTL und Cleanup lokal; NetworkMDNS sammelt verzögerte Netzwerkantworten über multicast-dns. CI injiziert den Transport; Interface-Auswahl und geräteübergreifende Zuverlässigkeit bleiben Integrationsarbeit.",
  ],
  "mixin-class-factory": [
    "Composes instance fields and prototype methods with validated configuration defaults.",
    "Kombiniert Instanzfelder und Prototypmethoden mit validierten Konfigurationsdefaults.",
    "Member collisions are rejected. Native private fields cannot be transplanted into another instance.",
    "Namenskollisionen werden abgelehnt. Native private Felder lassen sich nicht in eine fremde Instanz verpflanzen.",
  ],
  "neuronal-network": [
    "Executes numeric feed-forward inference and gradient-based learning with shape checks.",
    "Führt numerische Vorwärtsberechnung und gradientenbasiertes Lernen mit Formprüfungen aus.",
    "The educational sigmoid network uses squared-error gradients. It is not a tensor or GPU framework.",
    "Das didaktische Sigmoid-Netz nutzt Gradienten des quadratischen Fehlers. Es ist kein Tensor- oder GPU-Framework.",
  ],
  p2p: [
    "Starts TCP peers explicitly and transports bounded, length-prefixed frames.",
    "Startet TCP-Peers explizit und überträgt größenbegrenzte Frames mit Längenpräfix.",
    "Local discovery is the default; NetworkMDNS can be injected with an advertised network hostname. TCP data is unencrypted; trust establishment, authentication and replay protection need a full protocol.",
    "Lokale Discovery ist der Standard; NetworkMDNS lässt sich mit einem veröffentlichten Netzwerk-Hostnamen injizieren. TCP-Daten sind unverschlüsselt; Vertrauensaufbau, Authentifizierung und Replay-Schutz benötigen ein vollständiges Protokoll.",
  ],
  "parser-combinator": [
    "Composes byte-oriented parsers with slice-aware inputs and progress-checked repetition.",
    "Kombiniert byteorientierte Parser mit korrekten Input-Ausschnitten und Fortschrittsprüfung bei Wiederholung.",
    "The library has a broad combinator surface; the regression suite focuses on composition, view boundaries and termination.",
    "Die Bibliothek besitzt viele Kombinatoren; Regressionstests konzentrieren sich auf Kombination, View-Grenzen und Terminierung.",
  ],
  "priority-queue": [
    "Drains array and injected MongoDB-backed heaps in comparator order.",
    "Entnimmt Werte aus Array- und injizierten MongoDB-Heaps in Comparator-Reihenfolge.",
    "Persistent operations require explicit initialization and one writer. Atomic multi-client MongoDB transactions remain outside the baseline.",
    "Persistenz erfordert explizite Initialisierung und einen Writer. Atomare MongoDB-Transaktionen für mehrere Clients liegen außerhalb des Basiskerns.",
  ],
  "prom-metrics-decorator": [
    "Reuses named metrics and records counters, gauges, histograms and summaries.",
    "Verwendet benannte Metriken wieder und erfasst Counter, Gauges, Histogramme und Summaries.",
    "Legacy decorators require compatible TypeScript settings. Labels must have bounded cardinality; class decoration exposes a metric handle.",
    "Legacy-Decorators erfordern passende TypeScript-Einstellungen. Labels brauchen begrenzte Kardinalität; Klassendekoration stellt einen Metrik-Handle bereit.",
  ],
  "prom-metrics-parser": [
    "Parses metric families, metadata, escaped labels and complete numeric values.",
    "Parst Metrikfamilien, Metadaten, escapte Labels und vollständige Zahlenwerte.",
    "This parser targets Prometheus text exposition, not all OpenMetrics extensions.",
    "Der Parser unterstützt Prometheus-Text-Exposition, nicht sämtliche OpenMetrics-Erweiterungen.",
  ],
  "proof-of-work": [
    "Mines and verifies SHA-256 prefix proofs with event-loop yielding and cancellation.",
    "Erzeugt und prüft SHA-256-Präfixbeweise mit Event-Loop-Freigabe und Abbruch.",
    "Difficulty is measured in repeated hexadecimal prefixes. Protocol challenge encoding and external work budgets remain caller responsibilities.",
    "Schwierigkeit zählt wiederholte Hex-Präfixe. Protokollkodierung und externe Rechenbudgets liegen beim Aufrufer.",
  ],
  random: [
    "Provides reproducible seeded generators and normalized weighted selection.",
    "Bietet reproduzierbare Seed-Generatoren und normalisierte gewichtete Auswahl.",
    "Fortuna is a compatibility name backed by node:crypto, not the Fortuna algorithm. Seeded strategies are simulation generators; the Redis sketch is an explicitly unsupported integration.",
    "Fortuna ist ein Kompatibilitätsname für node:crypto, keine Fortuna-Implementierung. Seed-Strategien dienen Simulationen; die Redis-Skizze ist eine explizit nicht unterstützte Integration.",
  ],
  reactivity: [
    "Owns cold-source subscriptions with independent termination and exactly-once teardown.",
    "Verwaltet Cold-Source-Subscriptions mit unabhängiger Terminierung und genau einmaligem Teardown.",
    "The operator set is deliberately small. Hot multicasting, backpressure and schedulers require additional contracts.",
    "Die Operatorauswahl ist bewusst klein. Hot-Multicasting, Backpressure und Scheduler benötigen zusätzliche Verträge.",
  ],
  "safe-array": [
    "Applies queued mutations predictably without repeating additions or sharing constructor arrays.",
    "Verarbeitet gepufferte Mutationen ohne wiederholte Adds oder geteilte Konstruktor-Arrays.",
    "Removal is by value and removes all matches. Concurrent threads and nested-iteration isolation are not promised.",
    "Entfernen erfolgt wertbasiert für alle Treffer. Nebenläufige Threads und Isolation verschachtelter Iterationen werden nicht zugesagt.",
  ],
  signature: [
    "Signs JSON envelopes with RSA-SHA256 and encrypts key exports using AES-GCM.",
    "Signiert JSON-Umschläge mit RSA-SHA256 und verschlüsselt Schlüsselexporte per AES-GCM.",
    "Keys are local to the signer. Production trust distribution, canonical serialization and rotation policy need an application design.",
    "Schlüssel gehören lokal zum Signer. Produktiver Vertrauensaufbau, kanonische Serialisierung und Rotation benötigen ein Anwendungsdesign.",
  ],
  "slot-mashine": [
    "Simulates weighted reels, horizontal and diagonal payouts, credits and free spins.",
    "Simuliert gewichtete Walzen, horizontale und diagonale Gewinne, Credits und Freispiele.",
    "The engine is an educational deterministic simulation. UI, real-money accounting and regulatory requirements are outside its contract.",
    "Die Engine ist eine didaktische deterministische Simulation. UI, Echtgeldbuchhaltung und regulatorische Anforderungen liegen außerhalb ihres Vertrags.",
  ],
  "state-machine": [
    "Serializes transitions, awaits guards and enters the correct target state.",
    "Serialisiert Übergänge, wartet Guards ab und betritt den korrekten Zielzustand.",
    "Actions may have external effects. Do not await recursively dispatched events from inside an active action; schedule follow-up events after it finishes.",
    "Aktionen können externe Effekte haben. Rekursiv ausgelöste Events innerhalb einer aktiven Aktion nicht abwarten; Folgeereignisse nach ihrem Ende einplanen.",
  ],
  "state-store": [
    "Owns state snapshots and exposes explicit updates and disposable subscriptions.",
    "Besitzt eigene Zustandskopien mit expliziten Updates und abmeldbaren Subscriptions.",
    "State values must be structured-cloneable. Nested changes require an explicit set; proxy-reserved names cannot be state keys.",
    "Werte müssen per structuredClone kopierbar sein. Verschachtelte Änderungen benötigen set; reservierte Proxy-Namen dürfen keine State-Schlüssel sein.",
  ],
  "stats-tracker": [
    "Measures sliding-window event counts with an injectable monotonic clock.",
    "Misst Ereigniszahlen im gleitenden Fenster mit austauschbarer monotoner Uhr.",
    "Counts cover the configured window, not all history. Memory scales with event volume in that window.",
    "Zähler betreffen das konfigurierte Fenster, nicht die gesamte Historie. Speicherbedarf wächst mit den Ereignissen im Fenster.",
  ],
  swarm: [
    "Broadcasts to bounded, uniquely identified local worker endpoints and preserves partial success.",
    "Sendet an eine begrenzte Gruppe eindeutiger lokaler Worker und erhält Teilerfolge.",
    "The verified core is local orchestration. Remote execution, authentication, retries and heartbeats require a network adapter.",
    "Der geprüfte Kern ist lokale Orchestrierung. Remote-Ausführung, Authentifizierung, Wiederholungen und Heartbeats benötigen einen Netzwerkadapter.",
  ],
  "task-manager": [
    "Schedules prioritized asynchronous tasks within a fixed concurrency limit.",
    "Plant priorisierte asynchrone Tasks innerhalb einer festen Parallelitätsgrenze.",
    "Shutdown rejects waiting work and lets active tasks finish. CPU isolation and persistent queues are separate concerns.",
    "Shutdown weist wartende Arbeit zurück und lässt aktive Tasks enden. CPU-Isolation und persistente Queues sind separate Aufgaben.",
  ],
  "ts-error": [
    "Captures failures and safely normalizes hostile, cyclic or asynchronous thrown values.",
    "Fängt Fehler und normalisiert problematische, zyklische oder asynchrone Fehlerwerte sicher.",
    "The compatibility result format still makes an Error returned as ordinary data ambiguous. A tagged Result is a possible future major API.",
    "Das kompatible Ergebnisformat lässt Error als regulären Rückgabewert mehrdeutig. Ein markierter Result-Typ ist eine mögliche spätere Hauptversion.",
  ],
  "webgl-sand-engine": [
    "Runs a deterministic CPU sand reference and bounded neighbor queries.",
    "Führt eine deterministische CPU-Sandreferenz und begrenzte Nachbarschaftsabfragen aus.",
    "The verified core conserves particles and uses snapshot updates. Full WebGL simulation, water and chunk synchronization remain future integrations.",
    "Der geprüfte Kern erhält Partikel und nutzt Snapshot-Updates. Vollständige WebGL-Simulation, Wasser und Chunk-Synchronisation bleiben spätere Integrationen.",
  ],
  "webgl-shader-factory": [
    "Owns shader compilation, linking, required locations and idempotent disposal.",
    "Verwaltet Shader-Kompilierung, Linking, benötigte Locations und idempotente Freigabe.",
    "Unit tests use a deterministic WebGL mock. Browser-specific drivers and context restoration require integration testing.",
    "Unit-Tests verwenden einen deterministischen WebGL-Mock. Browserspezifische Treiber und Context-Wiederherstellung benötigen Integrationstests.",
  ],
  "worker-pool": [
    "Executes trusted self-contained functions on bounded persistent workers with timeout recovery.",
    "Führt vertrauenswürdige eigenständige Funktionen auf begrenzten Workern mit Timeout-Erholung aus.",
    "Function source cannot capture closures and must never be untrusted. A preinstalled handler registry and transferables are future extensions.",
    "Funktionsquellcode kann keine Closures übernehmen und darf nie unvertrauenswürdig sein. Vorinstallierte Handler-Registries und Transferables sind mögliche Erweiterungen.",
  ],
};
const apis = {
  "ai-function-caller": [
    [
      "query(message, signal?)",
      "Execute a bounded conversation and validated local handlers.",
      "Führt einen begrenzten Dialog mit geprüften lokalen Handlern aus.",
    ],
    [
      "AIFunctionCallerOptions",
      "Inject the provider, model and step limit.",
      "Injiziert Provider, Modell und Schrittlimit.",
    ],
  ],
  "bit-mask": [
    [
      "BitwiseFeatureFlags",
      "Own independent declared feature bits.",
      "Verwaltet unabhängige deklarierte Feature-Bits.",
    ],
    [
      "enableFlag / disableFlag / isFlagEnabled",
      "Validate and manipulate one declared single-bit flag.",
      "Validiert und verändert ein deklariertes Einzelbit.",
    ],
  ],
  cli: [
    [
      "Cli / CommandHandler",
      "Register and dispatch commands explicitly.",
      "Registriert und verarbeitet Befehle explizit.",
    ],
    [
      "ICommand / IArgument / IFlag",
      "Describe a handler and validated inputs.",
      "Beschreibt Handler und validierte Eingaben.",
    ],
    [
      "use(middleware)",
      "Await middleware around the command.",
      "Wartet Middleware um den Befehl herum ab.",
    ],
  ],
  "complex-compare": [
    [
      "arrayDifference(left, right)",
      "Return left values absent on the right.",
      "Liefert linke Werte, die rechts fehlen.",
    ],
    [
      "objectDifference(left, right)",
      "Return changed own keys as old/new value tuples.",
      "Liefert geänderte eigene Schlüssel als Alt/Neu-Tupel.",
    ],
  ],
  functional: [
    [
      "Some / None / Ok / Err",
      "Construct immutable tagged wrappers.",
      "Erzeugt unveränderliche markierte Hüllen.",
    ],
    [
      "isSome / isNone / isOk / isErr / match",
      "Narrow and handle each variant.",
      "Verengt und verarbeitet die jeweiligen Varianten.",
    ],
  ],
  i811n: [
    [
      "TranslationManager",
      "Select a supported catalog locale.",
      "Wählt eine unterstützte Katalogsprache.",
    ],
    [
      "Translator.translate(key, variables?)",
      "Resolve a key and substitute literal values.",
      "Löst einen Schlüssel auf und ersetzt literale Werte.",
    ],
  ],
  "neuronal-network": [
    [
      "Neuron / Layer",
      "Represent numeric activations and weighted connections.",
      "Repräsentiert numerische Aktivierungen und gewichtete Verbindungen.",
    ],
    [
      "Network.activate / train",
      "Evaluate feed-forward outputs and update parameters.",
      "Berechnet Vorwärtsausgaben und aktualisiert Parameter.",
    ],
    [
      "toObject()",
      "Serialize graph identifiers without cycles.",
      "Serialisiert Graph-IDs ohne Zyklen.",
    ],
  ],
  p2p: [
    [
      "P2P.start / discoverPeers / destroy",
      "Own the TCP server and discovery lifecycle.",
      "Verwaltet TCP-Server und Discovery-Lebenszyklus.",
    ],
    [
      "Peer.connect / send / disconnect",
      "Transport bounded plaintext frames over TCP.",
      "Überträgt begrenzte Klartext-Frames über TCP.",
    ],
    [
      "KeyPairEncryption",
      "Demonstrate RSA encryption and signing as separate primitives.",
      "Demonstriert RSA-Verschlüsselung und Signieren als separate Primitive.",
    ],
  ],
  "prom-metrics-parser": [
    [
      "parsePrometheusMetrics(text)",
      "Read metadata and samples into separate families.",
      "Liest Metadaten und Samples in getrennte Familien.",
    ],
    [
      "parseSample / parseLabels",
      "Validate numeric tokens and escaped quoted labels.",
      "Validiert Zahlentokens und escapte Labelwerte.",
    ],
  ],
  "proof-of-work": [
    [
      "ProofOfWork.mine",
      "Search cooperatively with an optional AbortSignal.",
      "Sucht kooperativ mit optionalem AbortSignal.",
    ],
    [
      "ProofOfWork.validate",
      "Recompute one proof and check its target.",
      "Berechnet einen Beweis neu und prüft das Ziel.",
    ],
  ],
  "slot-mashine": [
    [
      "FruitSlotMachine.betAndSpin",
      "Apply wagers, paylines and free-spin state.",
      "Verarbeitet Einsatz, Gewinnlinien und Freispielzustand.",
    ],
    [
      "Reel / FruitReel",
      "Sample weighted symbols using injectable randomness.",
      "Zieht gewichtete Symbole mit injizierbarer Zufallsquelle.",
    ],
    [
      "getCredit / getFreeSpins",
      "Read explicit simulation state.",
      "Liest expliziten Simulationszustand.",
    ],
  ],
  "state-store": [
    [
      "createStateStore / StateStore",
      "Construct a store that owns its state.",
      "Erzeugt einen Store mit eigenem Zustand.",
    ],
    [
      "set / snapshot",
      "Update explicitly and read independent copies.",
      "Aktualisiert explizit und liest unabhängige Kopien.",
    ],
    [
      "subscribe",
      "Observe one property and return an unsubscribe function.",
      "Beobachtet eine Eigenschaft und liefert eine Abmeldefunktion.",
    ],
  ],
  "stats-tracker": [
    [
      "logEvent",
      "Append an event using the injected clock.",
      "Erfasst ein Ereignis mit der injizierten Uhr.",
    ],
    [
      "getCount / getRatePerMinute",
      "Read a fresh window count or normalized rate.",
      "Liest aktuelle Fensterzähler oder normalisierte Raten.",
    ],
  ],
  swarm: [
    [
      "Manager.registerNode / unregisterNode",
      "Maintain a bounded unique endpoint registry.",
      "Verwaltet eine begrenzte Registry eindeutiger Endpunkte.",
    ],
    [
      "Manager.broadcast",
      "Collect per-endpoint successes and errors.",
      "Sammelt Erfolge und Fehler je Endpunkt.",
    ],
    [
      "Worker.execute",
      "Run a local typed handler.",
      "Führt einen lokalen typisierten Handler aus.",
    ],
  ],
  "task-manager": [
    [
      "TaskManager.addTask",
      "Return a promise for a prioritized task.",
      "Liefert ein Promise für einen priorisierten Task.",
    ],
    [
      "destroy",
      "Reject waiting work and stop accepting tasks.",
      "Lehnt wartende Arbeit ab und stoppt neue Tasks.",
    ],
  ],
  "webgl-sand-engine": [
    [
      "SandSimulation.step / snapshot",
      "Advance one deterministic CPU step and read a copy.",
      "Führt einen deterministischen CPU-Schritt aus und liefert eine Kopie.",
    ],
    [
      "NeighborProvider.getNeighbors",
      "Filter positioned items within a bounded radius.",
      "Filtert positionierte Elemente innerhalb eines begrenzten Radius.",
    ],
  ],
  "webgl-shader-factory": [
    [
      "ShaderProgramFactory",
      "Compile, link and own a WebGL program.",
      "Kompiliert, linkt und besitzt ein WebGL-Programm.",
    ],
    [
      "getUniformLocations / getAttributeLocations",
      "Require each requested location to exist.",
      "Verlangt vorhandene Locations für jeden angefragten Namen.",
    ],
    [
      "use / dispose",
      "Activate or release the program explicitly.",
      "Aktiviert oder gibt das Programm explizit frei.",
    ],
  ],
  "worker-pool": [
    [
      "WorkerPool.executeMethod",
      "Enqueue a trusted self-contained function and arguments.",
      "Plant eine vertrauenswürdige eigenständige Funktion mit Argumenten ein.",
    ],
    [
      "WorkerPoolOptions",
      "Set queue capacity and task timeout.",
      "Legt Queue-Kapazität und Task-Timeout fest.",
    ],
    [
      "destroy",
      "Reject pending promises and await worker termination.",
      "Lehnt offene Promises ab und wartet Worker-Ende ab.",
    ],
  ],
};
Object.assign(apis, {
  assert: [
    [
      "assert / isString / isNumber",
      "Check runtime conditions and narrow types.",
      "Prüft Laufzeitbedingungen und verengt Typen.",
    ],
    [
      "isDefined / isNotNull",
      "Exclude exactly undefined or null.",
      "Schließt genau undefined beziehungsweise null aus.",
    ],
    [
      "throws / AssertionError",
      "Verify synchronous throwing with a distinct error type.",
      "Prüft synchrones Werfen mit unterscheidbarem Fehlertyp.",
    ],
  ],
  "better-map": [
    [
      "update",
      "Transform existing values or initialize missing entries.",
      "Transformiert vorhandene Werte oder initialisiert fehlende Einträge.",
    ],
    [
      "filter / merge",
      "Filter to a new map or mutate by merging.",
      "Filtert in eine neue Map oder vereinigt mutierend.",
    ],
  ],
  "better-set": [
    [
      "merge / both / except / filter",
      "Perform union, intersection, argument-minus-receiver difference and filtering.",
      "Berechnet Vereinigung, Schnittmenge, Argument-minus-Empfänger-Differenz und Filterung.",
    ],
  ],
  "binary-serializer": [
    [
      "BinarySerializer.serialize / deserialize",
      "Read and write explicit fixed-layout schemas.",
      "Liest und schreibt explizite feste Layoutschemas.",
    ],
    [
      "Serializable / AsNumber / AsBoolean / AsString / AsArray / Serialized",
      "Declare legacy decorator schemas, including nested serializable fields.",
      "Deklariert Legacy-Decorator-Schemas einschließlich verschachtelter serialisierbarer Felder.",
    ],
  ],
  logger: [
    [
      "Logger / getInstance",
      "Construct an isolated logger or access the compatibility singleton.",
      "Erzeugt einen isolierten Logger oder liefert das kompatible Singleton.",
    ],
    [
      "trace / debug / info / warn / error / fatal",
      "Apply severity filtering and write messages without process termination.",
      "Filtert nach Schweregrad und schreibt ohne Prozessbeendigung.",
    ],
    [
      "profile / profileSync",
      "Measure work and clean up its animation.",
      "Misst Arbeit und räumt ihre Animation auf.",
    ],
  ],
  lsystem: [
    [
      "LSystem / generate",
      "Rewrite an axiom using validated weighted rules.",
      "Schreibt ein Axiom mit validierten gewichteten Regeln um.",
    ],
    [
      "Rule / SymbolType",
      "Describe symbols, replacements and relative weights.",
      "Beschreibt Symbole, Ersetzungen und relative Gewichte.",
    ],
  ],
  mdns: [
    [
      "MDNS.query / announce / destroy",
      "Discover matching local records, publish them and remove owned records.",
      "Findet passende lokale Records, veröffentlicht sie und entfernt eigene Records.",
    ],
    [
      "DNSRecord / DNSType",
      "Describe supported record data and query types.",
      "Beschreibt unterstützte Recorddaten und Abfragetypen.",
    ],
  ],
  "mixin-class-factory": [
    [
      "ConfigProperty / InterfaceMethod",
      "Declare configuration metadata and method contracts.",
      "Deklariert Konfigurationsmetadaten und Methodenverträge.",
    ],
    [
      "createClass",
      "Compose fields and prototype descriptors with collision checks.",
      "Kombiniert Felder und Prototypdeskriptoren mit Kollisionsprüfung.",
    ],
  ],
  "parser-combinator": [
    [
      "Parser / map / chain / run",
      "Compose and execute parser state transformations.",
      "Kombiniert und startet Parser-Zustandstransformationen.",
    ],
    [
      "str / char / regex / sequenceOf / choice / many / sepBy",
      "Build primitives, alternatives and progress-checked repetition.",
      "Erzeugt Primitive, Alternativen und Wiederholung mit Fortschrittsprüfung.",
    ],
  ],
  "priority-queue": [
    [
      "ConcretePriorityQueue / MemoryPriorityQueue",
      "Own an array-backed minimum heap.",
      "Verwaltet einen Array-basierten Min-Heap.",
    ],
    [
      "enqueue / dequeue / heapSort",
      "Insert, remove and drain in comparator order.",
      "Fügt ein, entfernt und leert in Comparator-Reihenfolge.",
    ],
    [
      "MongoDBPriorityQueue.initDB / destroy",
      "Connect explicitly or inject a collection, then close explicitly.",
      "Verbindet explizit oder injiziert eine Collection und schließt explizit.",
    ],
  ],
  "prom-metrics-decorator": [
    [
      "PromCounter / PromGauge / PromHistogram / PromSummary",
      "Create reusable call or value instrumentation.",
      "Erzeugt wiederverwendbare Aufruf- oder Wertinstrumentierung.",
    ],
    [
      "TrackOption / IMetricConfig",
      "Choose semantics, labels and metric configuration.",
      "Wählt Semantik, Labels und Metrikkonfiguration.",
    ],
  ],
  random: [
    [
      "Seed / PseudoRandomNumberGenerator",
      "Represent seed bytes and reproducible number streams.",
      "Repräsentiert Seedbytes und reproduzierbare Zahlenfolgen.",
    ],
    [
      "LinearCongruential / XORShift / MersenneTwister / WichmannHill / LaggedFibonacci",
      "Choose a simulation generator strategy.",
      "Wählt eine Strategie für Simulationszufall.",
    ],
    [
      "Fortuna / PseudoRandomItemSelector",
      "Use OS randomness through a compatibility facade or select weighted items.",
      "Nutzt Betriebssystemzufall über eine Kompatibilitätsfassade oder wählt gewichtete Elemente.",
    ],
  ],
  reactivity: [
    [
      "SimpleObservable / SimpleSubscription",
      "Own independent cold-source execution and teardown.",
      "Verwaltet unabhängige Cold-Source-Ausführung und Teardown.",
    ],
    [
      "map / filter",
      "Transform or filter values while propagating terminal signals.",
      "Transformiert oder filtert Werte und reicht Endsignale weiter.",
    ],
  ],
  "safe-array": [
    [
      "SafeArray.add / remove / forEach / filter",
      "Queue changes and iterate a defined mutation boundary.",
      "Puffert Änderungen und iteriert mit definierten Mutationsgrenzen.",
    ],
    [
      "length / isEmpty",
      "Read effective contents including queued changes.",
      "Liest effektive Inhalte einschließlich gepufferter Änderungen.",
    ],
  ],
  signature: [
    [
      "Signature.signData / verifySignature",
      "Create and verify a JSON signature envelope.",
      "Erzeugt und prüft einen JSON-Signaturumschlag.",
    ],
    [
      "KeyPairEncryption",
      "Encrypt exported private keys using scrypt and AES-256-GCM.",
      "Verschlüsselt exportierte private Schlüssel per scrypt und AES-256-GCM.",
    ],
    [
      "PayloadSigner",
      "Sign and verify exact serialized bytes.",
      "Signiert und prüft exakte serialisierte Bytes.",
    ],
  ],
  "state-machine": [
    [
      "StateMachine / addTransition / transition",
      "Configure and serialize guarded state transitions.",
      "Konfiguriert und serialisiert Guard-geschützte Zustandsübergänge.",
    ],
    [
      "subscribe / getCurrentState / isInEndState",
      "Observe with explicit unsubscribe and inspect state.",
      "Beobachtet mit explizitem Abmelden und liest den Zustand.",
    ],
  ],
  "ts-error": [
    [
      "NormalizedError / toNormalizedError",
      "Represent unknown thrown values safely.",
      "Repräsentiert unbekannte Fehlerwerte sicher.",
    ],
    [
      "noThrow / isError / aggregateErrors",
      "Capture async or sync failures, recognize errors and combine messages.",
      "Fängt asynchrone und synchrone Fehler, erkennt sie und kombiniert Meldungen.",
    ],
  ],
});

const partial = new Set([
  "assert",
  "better-map",
  "better-set",
  "bit-mask",
  "complex-compare",
  "functional",
  "i811n",
  "safe-array",
  "lsystem",
  "priority-queue",
  "proof-of-work",
  "stats-tracker",
  "task-manager",
]);
export function applyEvidence(module, locale) {
  const row = evidence[module.slug];
  if (!row) throw new Error("Missing evidence contract: " + module.slug);
  const index = locale === "en" ? 0 : 1;
  return {
    ...module,
    summary: row[index],
    repositoryImplementation: row[index] + " " + row[index + 2],
    maturity: partial.has(module.slug) ? "partial" : "prototype",
    note: row[index + 2],
    api:
      apis[module.slug]?.map(([name, en, de]) => ({
        name,
        description: locale === "en" ? en : de,
      })) ??
      module.api.map((entry) => ({
        ...entry,
        name: entry.name.replace(/ \\([^)]*\\)/g, ""),
      })),
    evidence: {
      test: "packages/" + module.slug + "/src",
      example: "packages/" + module.slug + "/examples/basic.ts",
    },
  };
}
