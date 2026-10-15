# @ralphschuler/p2p

Starts TCP peers explicitly and transports bounded, length-prefixed frames.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/p2p/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/p2p/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/p2p/examples/basic.ts
yarn workspace @ralphschuler/p2p test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Local discovery is the default; NetworkMDNS can be injected with an advertised network hostname. TCP data is unencrypted; trust establishment, authentication and replay protection need a full protocol.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
