# @ralphschuler/signature

Signs JSON envelopes with RSA-SHA256 and encrypts key exports using AES-GCM.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/signature/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/signature/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/signature/examples/basic.ts
yarn workspace @ralphschuler/signature test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Keys are local to the signer. Production trust distribution, canonical serialization and rotation policy need an application design.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
