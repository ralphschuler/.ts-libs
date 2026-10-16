# @ralphschuler/assert

Enforces runtime conditions with matching TypeScript narrowing.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/assert/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/assert/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/assert/examples/basic.ts
yarn workspace @ralphschuler/assert test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Synchronous assertions throw; nested schemas and asynchronous rejection assertions are separate extensions.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
