# @ralphschuler/binary-serializer

Round-trips fixed-layout unsigned integers, booleans, UTF-8 strings and arrays.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/binary-serializer/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/binary-serializer/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/binary-serializer/examples/basic.ts
yarn workspace @ralphschuler/binary-serializer test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

This is a versionless fixed-layout format. Schema ordering and migration must be agreed by both endpoints; decorators use the legacy TypeScript contract.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
