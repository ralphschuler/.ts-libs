# @ralphschuler/stats-tracker

Measures sliding-window event counts with an injectable monotonic clock.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/stats-tracker/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/stats-tracker/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/stats-tracker/examples/basic.ts
yarn workspace @ralphschuler/stats-tracker test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Counts cover the configured window, not all history. Memory scales with event volume in that window.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
