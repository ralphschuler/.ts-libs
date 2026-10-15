# @ralphschuler/prom-metrics-decorator

Reuses named metrics and records counters, gauges, histograms and summaries.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/prom-metrics-decorator/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/prom-metrics-decorator/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/prom-metrics-decorator/examples/basic.ts
yarn workspace @ralphschuler/prom-metrics-decorator test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Legacy decorators require compatible TypeScript settings. Labels must have bounded cardinality; class decoration exposes a metric handle.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
