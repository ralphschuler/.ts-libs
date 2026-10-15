# @ralphschuler/task-manager

Schedules prioritized asynchronous tasks within a fixed concurrency limit.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/task-manager/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/task-manager/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/task-manager/examples/basic.ts
yarn workspace @ralphschuler/task-manager test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Shutdown rejects waiting work and lets active tasks finish. CPU isolation and persistent queues are separate concerns.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
