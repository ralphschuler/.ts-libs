# @ralphschuler/mixin-class-factory

Composes instance fields and prototype methods with validated configuration defaults.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/mixin-class-factory/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/mixin-class-factory/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/mixin-class-factory/examples/basic.ts
yarn workspace @ralphschuler/mixin-class-factory test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Member collisions are rejected. Native private fields cannot be transplanted into another instance.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
