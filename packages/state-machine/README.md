# @ralphschuler/state-machine

Serializes transitions, awaits guards and enters the correct target state.

## Learn the concept

[English](https://nyphon.de/.ts-libs/en/modules/state-machine/) · [Deutsch](https://nyphon.de/.ts-libs/de/modules/state-machine/)

## Run the verified example

From the repository root:

```sh
yarn tsx packages/state-machine/examples/basic.ts
yarn workspace @ralphschuler/state-machine test
```

The package exports ESM from dist/index.js and declarations from dist/index.d.ts. Run yarn build before importing workspace packages.

## Scope and next steps

Actions may have external effects. Do not await recursively dispatched events from inside an active action; schedule follow-up events after it finishes.

See [the completion matrix](../../documentation/completion-matrix.md) and [experiment standards](../../documentation/experiment-standards.md).

MIT license.
