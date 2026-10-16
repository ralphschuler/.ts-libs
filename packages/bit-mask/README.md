# @ralphschuler/bit-mask

Manages validated independent feature bits through a public API.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/bit-mask/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/bit-mask/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/bit-mask/examples/basic.ts
yarn workspace @ralphschuler/bit-mask test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Number bitwise operations support positive single bits through bit 30. Wider masks need BigInt.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
