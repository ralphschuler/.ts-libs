import { ConcretePriorityQueue } from "./ConcretePriorityQueue.js";
/** Array-backed heap. Length counts stored values, never allocated capacity. */
export class MemoryPriorityQueue<T> extends ConcretePriorityQueue<T> {}
