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
    if (value === null) this.storage.splice(index, 1);
    else this.storage[index] = value;
  }

  public async clear(): Promise<void> {
    this.storage = [];
  }
}
