import { Logger } from "@lib-lib/logger";
import { ComparatorFunction } from "./types/ComparatorFunction.js";
import { Optional } from "./types/Optional.js";
import { PriorityQueueOptions } from "./types/PriorityQueueOptions.js";
import { AbstractPriorityQueue } from "./AbstractPriorityQueue.js";

export class ConcretePriorityQueue<T> extends AbstractPriorityQueue<T> {
  private storage: Array<T | null> = [];

  public get length(): number {
    return this.storage.length;
  }

  protected async getEntry(index: number): Promise<T | null> {
    return this.storage[index] ?? null;
  }

  protected async setEntry(index: number, value: T | null): Promise<void> {
    this.storage[index] = value;
  }

  public async clear(): Promise<void> {
    this.storage = [];
  }
}
