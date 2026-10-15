# Experiment completion standard

Every experiment remains part of this repository. The documentation must say
what it teaches and what its current implementation can safely demonstrate.

An experiment is **correct** when it has all of the following:

1. Its package has an explicit public entry point and builds under the pinned
   toolchain.
2. Its documented smallest useful behaviour has focused tests that execute in
   CI without a developer machine, secret, or unmanaged network service.
3. Importing the package does not start a demo, write to stdout, open a socket,
   or perform other surprising side effects.
4. Unsupported operations and integrations fail explicitly and are documented.
5. The module page’s implementation note and maturity badge match the tested
   repository state.

Maturity badges are evidence, not marketing:

- **Sketch**: an intentionally incomplete design, kept because its interfaces
  or partial implementation are useful for learning.
- **Prototype**: a runnable narrow core with tests, but incomplete boundaries,
  API, or production safeguards.
- **Partial**: a coherent public API whose documented core is tested, with
  clearly stated limitations.
- **Stable core**: a compatible, tested core with deliberate error and resource
  behaviour. It does not promise every integration is production-ready.

Experiments that require a browser, MongoDB, Redis, mDNS, external AI service,
or other runtime receive a service-free unit suite first. Integration coverage
is added as an optional, explicitly provisioned job rather than making the
baseline workflow unreliable.
