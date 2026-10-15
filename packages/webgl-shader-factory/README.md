# @ralphschuler/webgl-shader-factory

Owns shader compilation, linking, required locations and idempotent disposal.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/webgl-shader-factory/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/webgl-shader-factory/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/webgl-shader-factory/examples/basic.ts
yarn workspace @ralphschuler/webgl-shader-factory test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Unit tests use a deterministic WebGL mock. Browser-specific drivers and context restoration require integration testing.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
