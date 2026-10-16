import assert from "node:assert/strict";
import { createStateStore } from "../src/index.js";
const store = createStateStore({ count: 0 });
const observed: number[] = [];
const unsubscribe = store.subscribe("count", (value) => observed.push(value));
store.set("count", 1);
unsubscribe();
assert.deepEqual(observed, [1]);
