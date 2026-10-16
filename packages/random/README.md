# @ralphschuler/random

Provides reproducible seeded generators and normalized weighted selection.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/random/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/random/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/random/examples/basic.ts
yarn workspace @ralphschuler/random test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Fortuna is a compatibility name backed by node:crypto, not the Fortuna algorithm. Seeded strategies are simulation generators; the Redis sketch is an explicitly unsupported integration.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
