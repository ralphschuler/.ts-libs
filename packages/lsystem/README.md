# @ralphschuler/lsystem

Rewrites symbol sequences with normalized weights and injectable randomness.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/lsystem/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/lsystem/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/lsystem/examples/basic.ts
yarn workspace @ralphschuler/lsystem test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Output can grow exponentially. Rendering and caller-specific output budgets are separate from grammar rewriting.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
