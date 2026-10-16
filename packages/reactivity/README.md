# @ralphschuler/reactivity

Owns cold-source subscriptions with independent termination and exactly-once teardown.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/reactivity/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/reactivity/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/reactivity/examples/basic.ts
yarn workspace @ralphschuler/reactivity test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

The operator set is deliberately small. Hot multicasting, backpressure and schedulers require additional contracts.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
