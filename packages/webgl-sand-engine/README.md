# @ralphschuler/webgl-sand-engine

Runs a deterministic CPU sand reference and bounded neighbor queries.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/webgl-sand-engine/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/webgl-sand-engine/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/webgl-sand-engine/examples/basic.ts
yarn workspace @ralphschuler/webgl-sand-engine test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

The verified core conserves particles and uses snapshot updates. Full WebGL simulation, water and chunk synchronization remain future integrations.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
