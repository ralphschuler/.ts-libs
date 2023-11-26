import { assert } from "../utils/assert.util.js";

/**
 * Asserts that a number is greater than another number.
 * @param actual - The actual number.
 * @param expected - The expected number.
 * @param message - Optional message to display on failure.
 */
export function greaterThan(
  actual: number,
  expected: number,
  message: string = "Value is not greater than expected",
): void {
  assert(actual > expected, message);
}
