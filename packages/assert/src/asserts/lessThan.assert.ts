import { assert } from "../utils/assert.util.js";

/**
 * Asserts that a number is less than another number.
 * @param actual - The actual number.
 * @param expected - The expected number.
 * @param message - Optional message to display on failure.
 */
export function lessThan(
  actual: number,
  expected: number,
  message: string = "Value is not less than expected",
): void {
  assert(actual < expected, message);
}
