# @ralphschuler/i811n

Resolves language catalogs and interpolates literal placeholder values.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/i811n/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/i811n/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/i811n/examples/basic.ts
yarn workspace @ralphschuler/i811n test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

No plural-message syntax is implemented. Use Intl for dates, numbers and plural selection.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
