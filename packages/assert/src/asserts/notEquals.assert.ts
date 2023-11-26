import { assert } from "../utils/assert.util.js";

/**
 * Asserts that two values are not equal.
 * @param actual - The actual value.
 * @param expected - The expected value.
 * @param message - Optional message to display on failure.
 */
export function notEquals<T>(
  actual: T,
  expected: T,
  message: string = "Values are equal",
): void {
  assert(actual !== expected, message);
}
