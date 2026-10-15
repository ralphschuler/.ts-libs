# @ralphschuler/cli

Dispatches validated argv commands through awaited middleware.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/cli/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/cli/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/cli/examples/basic.ts
yarn workspace @ralphschuler/cli test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Pass argv arrays to preserve shell quoting. Interactive input and shell completion are separate adapters.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
