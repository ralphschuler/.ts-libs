import { assert } from "../utils/assert.util.js";

/**
 * Asserts that two values are equal.
 * @param actual - The actual value.
 * @param expected - The expected value.
 * @param message - Optional message to display on failure.
 */
export function equals<T>(
  actual: T,
  expected: T,
  message: string = "Values are not equal",
): void {
  assert(actual === expected, message);
}
