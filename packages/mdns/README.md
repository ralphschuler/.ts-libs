# @ralphschuler/mdns

Provides a deterministic local discovery model and an explicitly started multicast adapter.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/mdns/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/mdns/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/mdns/examples/basic.ts
yarn workspace @ralphschuler/mdns test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

MDNS verifies TTL and cleanup locally; NetworkMDNS collects delayed network answers through multicast-dns. CI uses an injected transport; interface selection and cross-machine reliability remain integration work.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
