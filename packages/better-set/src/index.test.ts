import assert from "node:assert/strict";
import { it } from "node:test";
import { BetterSet } from "./index.js";
it("documents both directional differences, intersection and union", () => {
  const a = new BetterSet([1, 2]);
  const b = new BetterSet([2, 3]);
  assert.deepEqual([...a.except(b)], [3]); // Existing contract: argument minus receiver.
  assert.deepEqual([...b.except(a)], [1]);
  assert.deepEqual([...a.both(b)], [2]);
  a.merge(b);
  assert.deepEqual([...a], [1, 2, 3]);
});
