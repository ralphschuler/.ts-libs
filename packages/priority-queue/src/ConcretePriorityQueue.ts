import { Logger } from "../Logger/Logger";
import { ComparatorFunction } from "./types/ComparatorFunction";
import { Optional } from "./types/Optional";
import { PriorityQueueOptions } from "./types/PriorityQueueOptions";
import { AbstractPriorityQueue } from "./AbstractPriorityQueue";

export class ConcretePriorityQueue<T> extends AbstractPriorityQueue<T> {
  private storage: Array<T | null> = [];
  
  get length(): number {
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
