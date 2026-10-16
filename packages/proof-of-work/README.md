# @ralphschuler/proof-of-work

Mines and verifies SHA-256 prefix proofs with event-loop yielding and cancellation.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/proof-of-work/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/proof-of-work/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/proof-of-work/examples/basic.ts
yarn workspace @ralphschuler/proof-of-work test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Difficulty is measured in repeated hexadecimal prefixes. Protocol challenge encoding and external work budgets remain caller responsibilities.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
