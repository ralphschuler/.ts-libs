# @ralphschuler/ts-error

Captures failures and safely normalizes hostile, cyclic or asynchronous thrown values.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/ts-error/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/ts-error/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/ts-error/examples/basic.ts
yarn workspace @ralphschuler/ts-error test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

The compatibility result format still makes an Error returned as ordinary data ambiguous. A tagged Result is a possible future major API.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
