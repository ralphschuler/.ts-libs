import assert from "node:assert/strict";
import { SafeArray } from "../src/index.js";
const values = new SafeArray([1, 2]);
values.add(3);
values.remove(2);
assert.deepEqual(
  values.filter(() => true),
  [1, 3],
);
