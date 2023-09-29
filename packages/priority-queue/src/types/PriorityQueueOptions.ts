import { ComparatorFunction } from "./ComparatorFunction";

/**
 * Represents options for initializing a PriorityQueue.
 * @template T The type of values stored in the PriorityQueue.
 */
export type PriorityQueueOptions<T> = {
  comparatorFunction: ComparatorFunction<T>;
}
