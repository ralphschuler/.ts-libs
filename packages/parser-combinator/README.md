# @ralphschuler/parser-combinator

Composes byte-oriented parsers with slice-aware inputs and progress-checked repetition.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/parser-combinator/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/parser-combinator/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/parser-combinator/examples/basic.ts
yarn workspace @ralphschuler/parser-combinator test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

The library has a broad combinator surface; the regression suite focuses on composition, view boundaries and termination.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
