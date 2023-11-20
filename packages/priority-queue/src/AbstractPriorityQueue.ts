import { ComparatorFunction } from "./types/ComparatorFunction.js";
import { Optional } from "./types/Optional.js";
import { PriorityQueueOptions } from "./types/PriorityQueueOptions.js";

export abstract class AbstractPriorityQueue<T> {
  protected comparatorFunction: ComparatorFunction<T>;

  public constructor(options: PriorityQueueOptions<T>) {
    this.comparatorFunction = options.comparatorFunction;
  }

  public abstract get length(): number;
  protected abstract getEntry(index: number): Promise<T | null>;
  protected abstract setEntry(index: number, value: T | null): Promise<void>;
  public abstract clear(): Promise<void>;

  public async enqueue(value: T): Promise<void> {
    try {
      await this.setEntry(this.length, value);
      await this.bubbleUp();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject("Failed enqueuing: " + error);
    }
  }

  public async dequeue(): Promise<Optional<T | null>> {
    try {
      if (this.length === 0) {
        return Promise.resolve(null);
      }

      const node = await this.getEntry(0);

      if (this.length === 1) {
        await this.setEntry(0, null);
        return Promise.resolve(node);
      }

      await this.setEntry(0, await this.getEntry(this.length - 1));
      await this.setEntry(this.length - 1, null);
      await this.bubbleDown(0);

      return Promise.resolve(node);
    } catch (error) {
      return Promise.reject("Failed dequeuing: " + error);
    }
  }

  public async heapSort(): Promise<Array<T | null>> {
    try {
      const sorted: Array<T | null> = [];

      for (let i = 0; i < this.length; i++) {
        sorted.push(await this.dequeue());
      }

      return Promise.resolve(sorted);
    } catch (error) {
      return Promise.reject("Failed heap sorting: " + error);
    }
  }

  protected parent(nodeIndex: number): number | null {
    try {
      return nodeIndex === 0 ? null : Math.floor((nodeIndex - 1) / 2);
    } catch (error) {
      throw new Error("Failed getting parent: " + error);
    }
  }

  protected leftChild(nodeIndex: number): number | null {
    return nodeIndex * 2 + 1 >= this.length ? null : nodeIndex * 2 + 1;
  }

  protected rightChild(nodeIndex: number): number | null {
    return nodeIndex * 2 + 2 >= this.length ? null : nodeIndex * 2 + 2;
  }

  protected async bubbleUp(nodeIndex: number = this.length - 1): Promise<void> {
    try {
      const parentIndex = this.parent(nodeIndex);
      if (parentIndex === null) {
        return;
      }

      const parent = await this.getEntry(parentIndex);
      const node = await this.getEntry(nodeIndex);

      if (
        parent !== null &&
        node !== null &&
        (await this.comparatorFunction(node, parent)) < 0
      ) {
        await this.setEntry(parentIndex, node);
        await this.setEntry(nodeIndex, parent);
        await this.bubbleUp(parentIndex);
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject("Failed bubbling up: " + error);
    }
  }

  protected async bubbleDown(nodeIndex: number): Promise<void> {
    try {
      const leftChildIndex = this.leftChild(nodeIndex);
      const rightChildIndex = this.rightChild(nodeIndex);

      let swapCandidateIndex = nodeIndex;

      if (
        leftChildIndex !== null &&
        (await this.comparatorFunction(
          (await this.getEntry(leftChildIndex)) as T,
          (await this.getEntry(swapCandidateIndex)) as T,
        )) < 0
      ) {
        swapCandidateIndex = leftChildIndex;
      }

      if (
        rightChildIndex !== null &&
        (await this.comparatorFunction(
          (await this.getEntry(rightChildIndex)) as T,
          (await this.getEntry(swapCandidateIndex)) as T,
        )) < 0
      ) {
        swapCandidateIndex = rightChildIndex;
      }

      if (swapCandidateIndex !== nodeIndex) {
        const node = await this.getEntry(nodeIndex);
        const swapCandidate = await this.getEntry(swapCandidateIndex);

        if (node !== null && swapCandidate !== null) {
          await this.setEntry(nodeIndex, swapCandidate);
          await this.setEntry(swapCandidateIndex, node);
          await this.bubbleDown(swapCandidateIndex);
        }
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject("Failed bubbling down: " + error);
    }
  }
}
