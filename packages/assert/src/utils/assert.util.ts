import { AssertionError } from "../errors/AssertionError.error.js";

/**
 * Asserts that a condition is true.
 * @param condition - The condition to check.
 * @param message - Optional message to display on failure.
 */
export function assert(
  condition: boolean,
  message: string = "Assertion failed",
): asserts condition {
  if (!condition) {
    throw new AssertionError(message);
  }
}
