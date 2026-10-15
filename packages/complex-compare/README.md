# @ralphschuler/complex-compare

Computes directional array differences and shallow own-key object changes without global mutation.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/complex-compare/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/complex-compare/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/complex-compare/examples/basic.ts
yarn workspace @ralphschuler/complex-compare test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Object values are compared by identity; nested structural comparison is deliberately outside the core.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
