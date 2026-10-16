# @ralphschuler/state-store

Owns state snapshots and exposes explicit updates and disposable subscriptions.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/state-store/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/state-store/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/state-store/examples/basic.ts
yarn workspace @ralphschuler/state-store test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

State values must be structured-cloneable. Nested changes require an explicit set; proxy-reserved names cannot be state keys.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
