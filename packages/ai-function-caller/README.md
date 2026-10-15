# @ralphschuler/ai-function-caller

Runs a bounded, validated function-call conversation with an injectable provider.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/ai-function-caller/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/ai-function-caller/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/ai-function-caller/examples/basic.ts
yarn workspace @ralphschuler/ai-function-caller test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Provider calls are mocked in CI; flat schemas are supported. Real provider compatibility and application authorization remain integration concerns.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
