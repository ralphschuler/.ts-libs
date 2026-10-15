import { it } from "node:test";
import assert from "node:assert/strict";
import type { Collection } from "mongodb";
import { MongoDBPriorityQueue } from "./MongoDBPriorityQueue.js";

it("uses an injected collection without a live database and drains in priority order", async () => {
  type Value = { index: number; value: number };
  const records = new Map<number, Value>();
  const collection = {
    findOne: async ({ index }: { index: number }) =>
      records.has(index) ? { value: records.get(index) } : null,
    countDocuments: async () => records.size,
    updateOne: async (
      { index }: { index: number },
      { $set }: { $set: { value: Value } },
    ) => {
      records.set(index, $set.value);
    },
    deleteOne: async ({ index }: { index: number }) => {
      records.delete(index);
    },
    deleteMany: async () => {
      records.clear();
    },
  } as unknown as Collection;
  const queue = new MongoDBPriorityQueue<Value>(
    { comparatorFunction: (a, b) => a.value - b.value },
    "test",
    "tasks",
    collection,
  );
  for (const value of [5, 1, 3]) await queue.enqueue({ index: value, value });
  assert.equal(queue.length, 3);
  assert.deepEqual(
    (await queue.heapSort()).map((value) => value?.value),
    [1, 3, 5],
  );
  assert.equal(queue.length, 0);
  await queue.enqueue({ index: 7, value: 7 });
  await queue.clear();
  assert.equal(queue.length, 0);
  await queue.destroy();
});
it("does not connect from its constructor", () => {
  const queue = new MongoDBPriorityQueue<{ index: number }>(
    { comparatorFunction: (a, b) => a.index - b.index },
    "test",
    "tasks",
  );
  assert.throws(() => queue.length, /not initialized/);
});
