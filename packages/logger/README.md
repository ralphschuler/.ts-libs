# @ralphschuler/logger

Formats messages with corrected severity filtering, bounded history and explicit output.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/logger/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/logger/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/logger/examples/basic.ts
yarn workspace @ralphschuler/logger test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

The singleton is retained for compatibility; direct construction supports isolated tests. Fatal logs do not terminate the process.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
