import assert from "node:assert/strict";
import { PromCounter } from "../src/index.js";
const target = {
  run() {
    return 42;
  },
};
const descriptor = Object.getOwnPropertyDescriptor(target, "run")!;
PromCounter({ name: "example_calls", help: "Example calls" })(
  target,
  "run",
  descriptor,
);
Object.defineProperty(target, "run", descriptor);
assert.equal(target.run(), 42);
