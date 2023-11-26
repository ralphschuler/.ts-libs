import { assert } from "../utils/assert.util.js";

/**
 * Asserts that an array contains an item.
 * @param array - The array to check.
 * @param item - The item to check for.
 * @param message - Optional message to display on failure.
 */
export function arrayContains<T>(
  array: T[],
  item: T,
  message: string = "Array does not contain the item",
): void {
  assert(array.includes(item), message);
}
