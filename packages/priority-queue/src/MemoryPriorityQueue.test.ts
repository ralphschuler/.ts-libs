import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { ComparatorFunction } from "./types/ComparatorFunction.js";
import { MemoryPriorityQueue } from "./MemoryPriorityQueue.js";

describe("MemoryPriorityQueue", () => {
  let memoryPriorityQueue: MemoryPriorityQueue<number>;

  // Using a simple comparator function for numbers
  const comparatorFunction: ComparatorFunction<number> = (
    a: number,
    b: number,
  ) => a - b;

  beforeEach(() => {
    memoryPriorityQueue = new MemoryPriorityQueue<number>({
      comparatorFunction,
    });
  });

  it("should initialize with length 0", () => {
    assert.strictEqual(memoryPriorityQueue.length, 0);
  });

  it("should enqueue elements", async () => {
    await memoryPriorityQueue.enqueue(1);
    await memoryPriorityQueue.enqueue(2);
    assert.strictEqual(memoryPriorityQueue.length, 2);
  });

  it("should dequeue elements", async () => {
    await memoryPriorityQueue.enqueue(1);
    await memoryPriorityQueue.enqueue(2);
    const dequeued = await memoryPriorityQueue.dequeue();
    assert.strictEqual(dequeued, 1);
    assert.strictEqual(memoryPriorityQueue.length, 1);
  });

  it("should return null when dequeuing an empty queue", async () => {
    const dequeued = await memoryPriorityQueue.dequeue();
    assert.strictEqual(dequeued, null);
  });

  it("should clear the queue", async () => {
    await memoryPriorityQueue.enqueue(1);
    await memoryPriorityQueue.enqueue(2);
    await memoryPriorityQueue.clear();
    assert.strictEqual(memoryPriorityQueue.length, 0);
  });

  it("counts elements rather than allocated capacity and drains completely", async () => {
    for (const value of [5, 1, 3, 1, 0])
      await memoryPriorityQueue.enqueue(value);
    assert.strictEqual(memoryPriorityQueue.length, 5);
    assert.deepEqual(await memoryPriorityQueue.heapSort(), [0, 1, 1, 3, 5]);
    assert.strictEqual(memoryPriorityQueue.length, 0);
  });
});
