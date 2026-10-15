import assert from "node:assert/strict";
import { MemoryPriorityQueue } from "../src/index.js";
const queue = new MemoryPriorityQueue<number>({
  comparatorFunction: (a, b) => a - b,
});
for (const value of [3, 1, 2]) await queue.enqueue(value);
assert.deepEqual(await queue.heapSort(), [1, 2, 3]);
