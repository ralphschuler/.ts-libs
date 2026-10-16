# @ralphschuler/priority-queue

Drains array and injected MongoDB-backed heaps in comparator order.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/priority-queue/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/priority-queue/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/priority-queue/examples/basic.ts
yarn workspace @ralphschuler/priority-queue test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Persistent operations require explicit initialization and one writer. Atomic multi-client MongoDB transactions remain outside the baseline.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
