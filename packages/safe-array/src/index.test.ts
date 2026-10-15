import assert from "node:assert/strict";
import { it } from "node:test";
import { SafeArray } from "./index.js";
it("applies queued additions exactly once and owns its constructor array", () => {
  const source = [1];
  const array = new SafeArray(source);
  source.push(9);
  array.add(2);
  assert.deepEqual(
    array.filter(() => true),
    [1, 2],
  );
  assert.deepEqual(
    array.filter(() => true),
    [1, 2],
  );
  array.remove(999);
  array.remove(2);
  array.remove(2);
  assert.equal(array.length, 1);
  assert.deepEqual(
    array.filter(() => true),
    [1],
  );
});
it("defers additions during iteration and skips pending removals", () => {
  const array = new SafeArray([1, 2]);
  const seen: number[] = [];
  array.forEach((value) => {
    seen.push(value);
    array.add(3);
    array.remove(2);
  });
  assert.deepEqual(seen, [1]);
  assert.deepEqual(
    array.filter(() => true),
    [1, 3],
  );
});
