import { assert } from "../utils/assert.util.js";

/**
 * Asserts that an array is not empty.
 * @param array - The array to check.
 * @param message - Optional message to display on failure.
 */
export function arrayNotEmpty<T>(
  array: T[],
  message: string = "Array is empty",
): void {
  assert(array.length > 0, message);
}
