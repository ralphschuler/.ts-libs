import { Logger } from "@ralphschuler/logger";
import { ComparatorFunction } from "./types/ComparatorFunction.js";
import { Optional } from "./types/Optional.js";
import { PriorityQueueOptions } from "./types/PriorityQueueOptions.js";
import { AbstractPriorityQueue } from "./AbstractPriorityQueue.js";

const logger = Logger.getInstance();

/**
 * Represents a priority queue data structure.
 * @template T The type of values stored in the priority queue.
 */
export class MemoryPriorityQueue<T> extends AbstractPriorityQueue<T> {
  private _length: number = 0;
  private _values: Array<T | null> = [];

  public constructor(options: PriorityQueueOptions<T>) {
    super(options);
  }

  public get length(): number {
    return this._length;
  }

  protected async getEntry(index: number): Promise<T | null> {
    if (index >= this._length) {
      logger.warn("Attempt to get entry beyond length.");
      return null;
    }

    return Promise.resolve(this._values[index]);
  }

  protected async setEntry(index: number, value: T | null): Promise<void> {
    if (index >= this._length) {
      this._length = index * 2 + 1;
      this._values.length = this._length;
    }

    this._values[index] = value;
    return Promise.resolve();
  }

  public async clear(): Promise<void> {
    this._length = 0;
    this._values = [];
    return Promise.resolve();
  }

  // Override enqueue to update length
  public override async enqueue(value: T): Promise<void> {
    this._length++;
    return await super.enqueue(value);
  }

  // Override dequeue to update length
  public override async dequeue(): Promise<Optional<T | null>> {
    if (this._length > 0) this._length--;
    return await super.dequeue();
  }
}
