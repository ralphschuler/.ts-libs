# Experiment completion matrix

All 35 experiments remain in the repository and in both handbook editions. Each now has a public ESM entry point, a focused regression suite, and an executable example. The verified core is deliberately distinguished from production readiness.

## Completion gate

Run `yarn check`: lint → package builds → strict source/test/example typecheck → regression tests → public import checks → 35 executable examples → bilingual site build and content/link/metadata validation.

Run `yarn docs:browser` for real Chromium desktop/mobile checks of both languages. Screenshots are written under .artifacts/browser/.

Run `yarn security:check` for the npm advisory audit of every workspace and its transitive dependencies. The updated lockfile passes without advisory exclusions. CI also builds the optional extracted HTML and Markdown API references with `yarn docs:all`.

The CI gate fails for missing source exports, missing tests/examples, placeholder test scripts, import-time output/listening sockets/timers, broken examples, missing language pages, bad metadata, or broken local links.

## Per-package contracts

| Experiment                   | Maturity  | Verified core                                                                                      | Evidence                                                                                                                   |
| ---------------------------- | --------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| AI Function Caller           | prototype | Runs a bounded, validated function-call conversation with an injectable provider.                  | [1 test file(s)](../packages/ai-function-caller/src/), [example](../packages/ai-function-caller/examples/basic.ts)         |
| Assert                       | partial   | Enforces runtime conditions with matching TypeScript narrowing.                                    | [1 test file(s)](../packages/assert/src/), [example](../packages/assert/examples/basic.ts)                                 |
| Better Map                   | partial   | Updates, filters and merges Map entries with explicit missing-value behavior.                      | [1 test file(s)](../packages/better-map/src/), [example](../packages/better-map/examples/basic.ts)                         |
| Better Set                   | partial   | Demonstrates union, intersection and the existing directional difference contract.                 | [1 test file(s)](../packages/better-set/src/), [example](../packages/better-set/examples/basic.ts)                         |
| Binary Serializer            | prototype | Round-trips fixed-layout unsigned integers, booleans, UTF-8 strings and arrays.                    | [2 test file(s)](../packages/binary-serializer/src/), [example](../packages/binary-serializer/examples/basic.ts)           |
| Bit Mask                     | partial   | Manages validated independent feature bits through a public API.                                   | [1 test file(s)](../packages/bit-mask/src/), [example](../packages/bit-mask/examples/basic.ts)                             |
| CLI                          | prototype | Dispatches validated argv commands through awaited middleware.                                     | [1 test file(s)](../packages/cli/src/), [example](../packages/cli/examples/basic.ts)                                       |
| Complex Compare              | partial   | Computes directional array differences and shallow own-key object changes without global mutation. | [1 test file(s)](../packages/complex-compare/src/), [example](../packages/complex-compare/examples/basic.ts)               |
| Functional                   | partial   | Exports tagged Option and Result values, guards and pattern matching.                              | [1 test file(s)](../packages/functional/src/), [example](../packages/functional/examples/basic.ts)                         |
| i811n                        | partial   | Resolves language catalogs and interpolates literal placeholder values.                            | [1 test file(s)](../packages/i811n/src/), [example](../packages/i811n/examples/basic.ts)                                   |
| Logger                       | prototype | Formats messages with corrected severity filtering, bounded history and explicit output.           | [2 test file(s)](../packages/logger/src/), [example](../packages/logger/examples/basic.ts)                                 |
| L-System                     | partial   | Rewrites symbol sequences with normalized weights and injectable randomness.                       | [1 test file(s)](../packages/lsystem/src/), [example](../packages/lsystem/examples/basic.ts)                               |
| mDNS                         | prototype | Provides a deterministic local discovery model and an explicitly started multicast adapter.        | [3 test file(s)](../packages/mdns/src/), [example](../packages/mdns/examples/basic.ts)                                     |
| Mixin Class Factory          | prototype | Composes instance fields and prototype methods with validated configuration defaults.              | [1 test file(s)](../packages/mixin-class-factory/src/), [example](../packages/mixin-class-factory/examples/basic.ts)       |
| Neuronal Network             | prototype | Executes numeric feed-forward inference and gradient-based learning with shape checks.             | [1 test file(s)](../packages/neuronal-network/src/), [example](../packages/neuronal-network/examples/basic.ts)             |
| P2P                          | prototype | Starts TCP peers explicitly and transports bounded, length-prefixed frames.                        | [3 test file(s)](../packages/p2p/src/), [example](../packages/p2p/examples/basic.ts)                                       |
| Parser Combinator            | prototype | Composes byte-oriented parsers with slice-aware inputs and progress-checked repetition.            | [1 test file(s)](../packages/parser-combinator/src/), [example](../packages/parser-combinator/examples/basic.ts)           |
| Priority Queue               | partial   | Drains array and injected MongoDB-backed heaps in comparator order.                                | [3 test file(s)](../packages/priority-queue/src/), [example](../packages/priority-queue/examples/basic.ts)                 |
| Prometheus Metrics Decorator | prototype | Reuses named metrics and records counters, gauges, histograms and summaries.                       | [1 test file(s)](../packages/prom-metrics-decorator/src/), [example](../packages/prom-metrics-decorator/examples/basic.ts) |
| Prometheus Metrics Parser    | prototype | Parses metric families, metadata, escaped labels and complete numeric values.                      | [1 test file(s)](../packages/prom-metrics-parser/src/), [example](../packages/prom-metrics-parser/examples/basic.ts)       |
| Proof of Work                | partial   | Mines and verifies SHA-256 prefix proofs with event-loop yielding and cancellation.                | [2 test file(s)](../packages/proof-of-work/src/), [example](../packages/proof-of-work/examples/basic.ts)                   |
| Random                       | prototype | Provides reproducible seeded generators and normalized weighted selection.                         | [1 test file(s)](../packages/random/src/), [example](../packages/random/examples/basic.ts)                                 |
| Reactivity                   | prototype | Owns cold-source subscriptions with independent termination and exactly-once teardown.             | [3 test file(s)](../packages/reactivity/src/), [example](../packages/reactivity/examples/basic.ts)                         |
| Safe Array                   | partial   | Applies queued mutations predictably without repeating additions or sharing constructor arrays.    | [1 test file(s)](../packages/safe-array/src/), [example](../packages/safe-array/examples/basic.ts)                         |
| Signature                    | prototype | Signs JSON envelopes with RSA-SHA256 and encrypts key exports using AES-GCM.                       | [2 test file(s)](../packages/signature/src/), [example](../packages/signature/examples/basic.ts)                           |
| Slot Mashine                 | prototype | Simulates weighted reels, horizontal and diagonal payouts, credits and free spins.                 | [1 test file(s)](../packages/slot-mashine/src/), [example](../packages/slot-mashine/examples/basic.ts)                     |
| State Machine                | prototype | Serializes transitions, awaits guards and enters the correct target state.                         | [2 test file(s)](../packages/state-machine/src/), [example](../packages/state-machine/examples/basic.ts)                   |
| State Store                  | prototype | Owns state snapshots and exposes explicit updates and disposable subscriptions.                    | [1 test file(s)](../packages/state-store/src/), [example](../packages/state-store/examples/basic.ts)                       |
| Stats Tracker                | partial   | Measures sliding-window event counts with an injectable monotonic clock.                           | [1 test file(s)](../packages/stats-tracker/src/), [example](../packages/stats-tracker/examples/basic.ts)                   |
| Swarm                        | prototype | Broadcasts to bounded, uniquely identified local worker endpoints and preserves partial success.   | [1 test file(s)](../packages/swarm/src/), [example](../packages/swarm/examples/basic.ts)                                   |
| Task Manager                 | partial   | Schedules prioritized asynchronous tasks within a fixed concurrency limit.                         | [1 test file(s)](../packages/task-manager/src/), [example](../packages/task-manager/examples/basic.ts)                     |
| TS Error                     | prototype | Captures failures and safely normalizes hostile, cyclic or asynchronous thrown values.             | [1 test file(s)](../packages/ts-error/src/), [example](../packages/ts-error/examples/basic.ts)                             |
| WebGL Sand Engine            | prototype | Runs a deterministic CPU sand reference and bounded neighbor queries.                              | [1 test file(s)](../packages/webgl-sand-engine/src/), [example](../packages/webgl-sand-engine/examples/basic.ts)           |
| WebGL Shader Factory         | prototype | Owns shader compilation, linking, required locations and idempotent disposal.                      | [1 test file(s)](../packages/webgl-shader-factory/src/), [example](../packages/webgl-shader-factory/examples/basic.ts)     |
| Worker Pool                  | prototype | Executes trusted self-contained functions on bounded persistent workers with timeout recovery.     | [1 test file(s)](../packages/worker-pool/src/), [example](../packages/worker-pool/examples/basic.ts)                       |

## Intentional integration limits and next steps

- **AI Function Caller:** Provider calls are mocked in CI; flat schemas are supported. Real provider compatibility and application authorization remain integration concerns.
- **Assert:** Synchronous assertions throw; nested schemas and asynchronous rejection assertions are separate extensions.
- **Better Map:** Values retain reference identity; callbacks are synchronous and can throw.
- **Better Set:** except computes argument minus receiver. The direction is retained and regression-tested.
- **Binary Serializer:** This is a versionless fixed-layout format. Schema ordering and migration must be agreed by both endpoints; decorators use the legacy TypeScript contract.
- **Bit Mask:** Number bitwise operations support positive single bits through bit 30. Wider masks need BigInt.
- **CLI:** Pass argv arrays to preserve shell quoting. Interactive input and shell completion are separate adapters.
- **Complex Compare:** Object values are compared by identity; nested structural comparison is deliberately outside the core.
- **Functional:** Wrappers are shallowly frozen; error capture and higher-order combinators are explicit extensions.
- **i811n:** No plural-message syntax is implemented. Use Intl for dates, numbers and plural selection.
- **Logger:** The singleton is retained for compatibility; direct construction supports isolated tests. Fatal logs do not terminate the process.
- **L-System:** Output can grow exponentially. Rendering and caller-specific output budgets are separate from grammar rewriting.
- **mDNS:** MDNS verifies TTL and cleanup locally; NetworkMDNS collects delayed network answers through multicast-dns. CI uses an injected transport; interface selection and cross-machine reliability remain integration work.
- **Mixin Class Factory:** Member collisions are rejected. Native private fields cannot be transplanted into another instance.
- **Neuronal Network:** The educational sigmoid network uses squared-error gradients. It is not a tensor or GPU framework.
- **P2P:** Local discovery is the default; NetworkMDNS can be injected with an advertised network hostname. TCP data is unencrypted; trust establishment, authentication and replay protection need a full protocol.
- **Parser Combinator:** The library has a broad combinator surface; the regression suite focuses on composition, view boundaries and termination.
- **Priority Queue:** Persistent operations require explicit initialization and one writer. Atomic multi-client MongoDB transactions remain outside the baseline.
- **Prometheus Metrics Decorator:** Legacy decorators require compatible TypeScript settings. Labels must have bounded cardinality; class decoration exposes a metric handle.
- **Prometheus Metrics Parser:** This parser targets Prometheus text exposition, not all OpenMetrics extensions.
- **Proof of Work:** Difficulty is measured in repeated hexadecimal prefixes. Protocol challenge encoding and external work budgets remain caller responsibilities.
- **Random:** Fortuna is a compatibility name backed by node:crypto, not the Fortuna algorithm. Seeded strategies are simulation generators; the Redis sketch is an explicitly unsupported integration.
- **Reactivity:** The operator set is deliberately small. Hot multicasting, backpressure and schedulers require additional contracts.
- **Safe Array:** Removal is by value and removes all matches. Concurrent threads and nested-iteration isolation are not promised.
- **Signature:** Keys are local to the signer. Production trust distribution, canonical serialization and rotation policy need an application design.
- **Slot Mashine:** The engine is an educational deterministic simulation. UI, real-money accounting and regulatory requirements are outside its contract.
- **State Machine:** Actions may have external effects. Do not await recursively dispatched events from inside an active action; schedule follow-up events after it finishes.
- **State Store:** State values must be structured-cloneable. Nested changes require an explicit set; proxy-reserved names cannot be state keys.
- **Stats Tracker:** Counts cover the configured window, not all history. Memory scales with event volume in that window.
- **Swarm:** The verified core is local orchestration. Remote execution, authentication, retries and heartbeats require a network adapter.
- **Task Manager:** Shutdown rejects waiting work and lets active tasks finish. CPU isolation and persistent queues are separate concerns.
- **TS Error:** The compatibility result format still makes an Error returned as ordinary data ambiguous. A tagged Result is a possible future major API.
- **WebGL Sand Engine:** The verified core conserves particles and uses snapshot updates. Full WebGL simulation, water and chunk synchronization remain future integrations.
- **WebGL Shader Factory:** Unit tests use a deterministic WebGL mock. Browser-specific drivers and context restoration require integration testing.
- **Worker Pool:** Function source cannot capture closures and must never be untrusted. A preinstalled handler registry and transferables are future extensions.

## GitHub backlog disposition

The former TODO bot imported documentation sentences as issues. Closing those imports did not prove implementation correctness. Their requirements were retained and checked against the package contracts above.

- **#45–#79:** map to the 35 experiments in this table, in order. Correctness requirements were repaired and regression-tested; genuine integration limits remain explicit above.
- **#35:** placeholder test scripts replaced in every package, with CI checks preventing their return.
- **#38–#41:** malformed generated-file/test fragments, closed as invalid imports.
- **PR #42:** EJS patch merged and synchronized. Subsequent cleanup removed the obsolete README generator and its now-unneeded dependency chain.
- **PR #37:** stale conflicting ip update closed. The current dependency graph has no node-ip package.
- **PR #43:** blocked development branch closed after review. Its fswatcher source was a BetterMap copy, not an independent watcher implementation. The useful multicast-dns dependency cache was recovered and the multicast adapter rebuilt with explicit lifecycle and tests.

## Product rules

English is the default. German is a complete separate edition. Old links preserve their article while redirecting to English. A concept is an explanation; an experiment is a tested narrow implementation; a production package additionally requires compatibility, operational limits, integration evidence and a maintenance policy. No package is labelled production-ready merely because it builds.
