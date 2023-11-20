import { assert } from "../utils/assert.util.js";

export function arrayContains<T>(
  array: T[],
  item: T,
  message: string = "Array does not contain the item",
): void {
  assert(array.includes(item), message);
}
