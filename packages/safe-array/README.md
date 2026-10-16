# @ralphschuler/safe-array

Applies queued mutations predictably without repeating additions or sharing constructor arrays.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/safe-array/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/safe-array/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/safe-array/examples/basic.ts
yarn workspace @ralphschuler/safe-array test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Removal is by value and removes all matches. Concurrent threads and nested-iteration isolation are not promised.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
