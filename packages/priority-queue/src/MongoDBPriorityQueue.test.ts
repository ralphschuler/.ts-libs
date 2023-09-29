import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { ComparatorFunction } from './types/ComparatorFunction';
import { MongoDBPriorityQueue } from './MongoDBPriorityQueue';
import sinon from 'sinon';
import { MongoClient, Db, Collection } from 'mongodb';

describe('MongoDBPriorityQueue', () => {
  let mongoDBPriorityQueue: MongoDBPriorityQueue<{ index: number, value: number }>;
  let mockCollection: sinon.SinonStubbedInstance<Collection>;

  // Using a simple comparator function for numbers
  const comparatorFunction: ComparatorFunction<{ index: number, value: number }> = (a, b) => a.value - b.value;

  beforeEach(async () => {
    mongoDBPriorityQueue = new MongoDBPriorityQueue<number>(
      { comparatorFunction },
      'testDB',
      'testCollection'
    );

    await mongoDBPriorityQueue.initDB('testDB', 'testCollection'); // This assumes you've made initDB a public or protected method
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should initialize with length 0', async () => {
    mockCollection.countDocuments.resolves(0);
    assert.strictEqual(await mongoDBPriorityQueue.length, 0);
  });

  it('should enqueue elements', async () => {
    mockCollection.countDocuments.resolves(1);
    mockCollection.updateOne.resolves();
    await mongoDBPriorityQueue.enqueue(value);
    assert.strictEqual(await mongoDBPriorityQueue.length, 1);
  });

  it('should dequeue an element', async () => {
    mockCollection.findOne.resolves({ index: 0, value: 1 });
    mockCollection.countDocuments.resolves(0);
    mockCollection.deleteOne.resolves();

    const dequeued = await mongoDBPriorityQueue.dequeue();
    assert.deepEqual(dequeued, value);
    assert.strictEqual(await mongoDBPriorityQueue.length, 0);
  });

  it('should clear the queue', async () => {
    mockCollection.deleteMany.resolves();
    mockCollection.countDocuments.resolves(0);

    await mongoDBPriorityQueue.clear();
    assert.strictEqual(await mongoDBPriorityQueue.length, 0);
  });

  it('should return null when dequeueing an empty queue', async () => {
    mockCollection.countDocuments.resolves(0);
    const dequeued = await mongoDBPriorityQueue.dequeue();
    assert.strictEqual(dequeued, null);
    assert.strictEqual(await mongoDBPriorityQueue.length, 0);
  });
});
