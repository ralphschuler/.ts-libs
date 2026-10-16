# @ralphschuler/worker-pool

Executes trusted self-contained functions on bounded persistent workers with timeout recovery.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/worker-pool/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/worker-pool/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/worker-pool/examples/basic.ts
yarn workspace @ralphschuler/worker-pool test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Function source cannot capture closures and must never be untrusted. A preinstalled handler registry and transferables are future extensions.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
