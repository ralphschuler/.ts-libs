import { ConcretePriorityQueue } from './ConcretePriorityQueue';
import * as assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';

describe('ConcretePriorityQueue', async () => {
  let priorityQueue: ConcretePriorityQueue<number>;

  // Using a simple comparator function for numbers
  const comparatorFunction = (a: number, b: number) => a - b;

  beforeEach(() => {
    priorityQueue = new ConcretePriorityQueue<number>({
      comparatorFunction,
    });
  });

  it('should initialize with length 0', async () => {
    assert.strictEqual(priorityQueue.length, 0);
  });

  it('should enqueue elements', async () => {
    await priorityQueue.enqueue(1);
    await priorityQueue.enqueue(2);
    assert.strictEqual(priorityQueue.length, 2);
  });

  it('should dequeue elements', async () => {
    await priorityQueue.enqueue(1);
    await priorityQueue.enqueue(2);
    const item = await priorityQueue.dequeue();
    assert.strictEqual(item, 1);
    assert.strictEqual(priorityQueue.length, 1);
  });

  it('should return null when dequeue is called on an empty queue', async () => {
    const item = await priorityQueue.dequeue();
    assert.strictEqual(item, null);
  });

  it('should clear the queue', async () => {
    await priorityQueue.enqueue(1);
    await priorityQueue.enqueue(2);
    await priorityQueue.clear();
    assert.strictEqual(priorityQueue.length, 0);
  });

  it('should correctly heapify the queue', async () => {
    priorityQueue['storage'] = [3, 1, 4, 1, 5, 9];
    priorityQueue['storage'] = await priorityQueue.heapSort();
    assert.deepEqual(priorityQueue['storage'], [1, 1, 3, 4, 5, 9]);
  });

  it('should correctly perform heap sort', async () => {
    await priorityQueue.enqueue(3);
    await priorityQueue.enqueue(1);
    await priorityQueue.enqueue(4);
    await priorityQueue.enqueue(1);
    await priorityQueue.enqueue(5);
    await priorityQueue.enqueue(9);
    const sorted = await priorityQueue.heapSort();
    assert.deepEqual(sorted, [1, 1, 3, 4, 5, 9]);
  });

  it('should correctly bubble up elements', async () => {
    await priorityQueue.enqueue(3);
    await priorityQueue.enqueue(5);
    await priorityQueue.enqueue(1);
    assert.strictEqual(await priorityQueue.getEntry(0), 1);
  });

  it('should correctly bubble down elements', async () => {
    await priorityQueue.enqueue(3);
    await priorityQueue.enqueue(1);
    await priorityQueue.enqueue(4);
    await priorityQueue.setEntry(0, 5);
    await priorityQueue['bubbleDown'](0);
    assert.strictEqual(await priorityQueue.getEntry(0), 1);
    assert.strictEqual(await priorityQueue.getEntry(1), 5);
  });
});
