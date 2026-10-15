# @ralphschuler/better-map

Updates, filters and merges Map entries with explicit missing-value behavior.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/better-map/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/better-map/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/better-map/examples/basic.ts
yarn workspace @ralphschuler/better-map test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Values retain reference identity; callbacks are synchronous and can throw.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
