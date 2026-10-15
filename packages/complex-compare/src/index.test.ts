import assert from "node:assert/strict";
import { it } from "node:test";
import { arrayDifference, objectDifference } from "./index.js";
it("compares directional arrays and own keys without modifying globals", () => {
  assert.deepEqual(arrayDifference([1, 2], [2, 3]), [1]);
  const changes = objectDifference({ a: 1, b: 2 }, { b: 3, c: 4 });
  assert.deepEqual(
    { ...changes },
    { a: [1, undefined], b: [2, 3], c: [undefined, 4] },
  );
  assert.equal(Object.hasOwn(Array.prototype, "difference"), false);
  assert.deepEqual(
    { ...objectDifference({ a: undefined }, {}) },
    { a: [undefined, undefined] },
  );
});
