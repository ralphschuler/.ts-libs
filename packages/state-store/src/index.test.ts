import assert from "node:assert/strict";
import { it } from "node:test";
import { createStateStore } from "./index.js";
it("exposes methods, owns state and supports explicit unsubscribe", () => {
  const initial = { count: 0, nested: { value: 1 } };
  const store = createStateStore(initial);
  const seen: number[] = [];
  const stop = store.subscribe("count", (value) => seen.push(value));
  store.set("count", 2);
  stop();
  store.set("count", 3);
  assert.deepEqual(seen, [2]);
  const snapshot = store.snapshot();
  snapshot.nested.value = 99;
  assert.equal(store.snapshot().nested.value, 1);
  initial.count = 9;
  assert.equal(store.snapshot().count, 3);
});
