import { MongoClient, Collection } from 'mongodb';
import { AbstractPriorityQueue } from './AbstractPriorityQueue';
import { ComparatorFunction } from './types/ComparatorFunction';
import { Optional } from './types/Optional';
import { PriorityQueueOptions } from './types/PriorityQueueOptions';

export class MongoDBPriorityQueue<T extends { index: number }> extends AbstractPriorityQueue<T> {
  private collection: Collection;
  private client: MongoClient;

  constructor(options: PriorityQueueOptions<T>, dbName: string, collectionName: string) {
    super(options);
    this.initDB(dbName, collectionName);
  }

  protected async initDB(dbName: string, collectionName: string) {
    this.client = new MongoClient('mongodb://localhost:27017');
    await this.client.connect();
    const db = this.client.db(dbName);
    this.collection = db.collection(collectionName);
  }

  protected async getEntry(index: number): Promise<T | null> {
    const result = await this.collection.findOne({ index });
    return result?.value || null;
  }

  protected async setEntry(index: number, value: T | null): Promise<void> {
    if (value === null) {
      await this.collection.deleteOne({ index });
    } else {
      await this.collection.updateOne({ index }, { $set: { value }}, { upsert: true });
    }
  }

  protected get length(): number {
    return this.collection.countDocuments();
  }

  public async clear(): Promise<void> {
    await this.collection.deleteMany({});
  }
}
