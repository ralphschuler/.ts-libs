# @ralphschuler/neuronal-network

Executes numeric feed-forward inference and gradient-based learning with shape checks.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/neuronal-network/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/neuronal-network/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/neuronal-network/examples/basic.ts
yarn workspace @ralphschuler/neuronal-network test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

The educational sigmoid network uses squared-error gradients. It is not a tensor or GPU framework.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
