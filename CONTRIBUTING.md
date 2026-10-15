# Contributing

Keep every experiment and describe its scope honestly. See [experiment standards](documentation/experiment-standards.md) and the [completion matrix](documentation/completion-matrix.md).

1. Use Node.js 24 and the pinned Yarn version. Run `yarn install --immutable --immutable-cache`.
2. Reproduce the problem with deterministic inputs and add a focused regression test.
3. Keep import-time behavior quiet. Start sockets, demos, timers, and provider work explicitly.
4. Keep the public entry point and examples consistent with the implementation. State unsupported behavior explicitly.
5. Update the English and German concept/evidence content when behavior changes.
6. Run `yarn check`. For website changes, also run `CHROME_PATH=chromium yarn docs:browser`.
7. Describe the concrete before/after behavior and validation in the pull request.

The baseline suite must not require secrets or unmanaged external services. Inject adapters for provider, database, clock, random, and GPU boundaries. Put optional integration demos under the relevant package's examples/ directory and document their prerequisites.

Large conceptual sketches can remain in the handbook, but must be labelled as sketches. The runnable examples are separately checked in CI. A maturity promotion needs evidence for the stronger contract; a successful build alone is insufficient.
