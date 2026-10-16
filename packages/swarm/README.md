# @ralphschuler/swarm

Broadcasts to bounded, uniquely identified local worker endpoints and preserves partial success.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/swarm/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/swarm/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/swarm/examples/basic.ts
yarn workspace @ralphschuler/swarm test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

The verified core is local orchestration. Remote execution, authentication, retries and heartbeats require a network adapter.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
