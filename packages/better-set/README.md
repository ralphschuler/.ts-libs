# @ralphschuler/better-set

Demonstrates union, intersection and the existing directional difference contract.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/better-set/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/better-set/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/better-set/examples/basic.ts
yarn workspace @ralphschuler/better-set test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

except computes argument minus receiver. The direction is retained and regression-tested.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
