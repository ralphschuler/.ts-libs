# @ralphschuler/prom-metrics-parser

Parses metric families, metadata, escaped labels and complete numeric values.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/prom-metrics-parser/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/prom-metrics-parser/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/prom-metrics-parser/examples/basic.ts
yarn workspace @ralphschuler/prom-metrics-parser test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

This parser targets Prometheus text exposition, not all OpenMetrics extensions.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
