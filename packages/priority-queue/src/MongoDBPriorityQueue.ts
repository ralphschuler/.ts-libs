import { MongoClient, Collection } from "mongodb";
import { AbstractPriorityQueue } from "./AbstractPriorityQueue.js";
import { ComparatorFunction } from "./types/ComparatorFunction.js";
import { Optional } from "./types/Optional.js";
import { PriorityQueueOptions } from "./types/PriorityQueueOptions.js";

export class MongoDBPriorityQueue<
  T extends { index: number },
> extends AbstractPriorityQueue<T> {
  private collection: Collection | undefined = undefined;
  private client: MongoClient | undefined = undefined;
  private _length: number = 0;

  constructor(
    options: PriorityQueueOptions<T>,
    dbName: string,
    collectionName: string,
  ) {
    super(options);
    this.initDB(dbName, collectionName);
  }

  protected async initDB(dbName: string, collectionName: string) {
    this.client = new MongoClient("mongodb://localhost:27017");
    await this.client.connect();
    const db = this.client.db(dbName);
    this.collection = db.collection(collectionName);
  }

  private isDBInitialized(): void {
    if (!this.collection) {
      throw new Error("Database is not initialized.");
    }

    if (!this.client) {
      throw new Error("Database is not initialized.");
    }
  }

  protected async getEntry(index: number): Promise<T | null> {
    this.isDBInitialized();
    const result = await this.collection!.findOne({ index });
    this._length = await this.collection!.countDocuments();
    return result?.value || null;
  }

  protected async setEntry(index: number, value: T | null): Promise<void> {
    this.isDBInitialized();
    if (value === null) {
      await this.collection!.deleteOne({ index });
    } else {
      await this.collection!.updateOne(
        { index },
        { $set: { value } },
        { upsert: true },
      );
    }

    this._length = await this.collection!.countDocuments();
  }

  public get length(): number {
    this.isDBInitialized();
    return this._length;
  }

  public async clear(): Promise<void> {
    this.isDBInitialized();
    await this.collection!.deleteMany({});
  }
}
