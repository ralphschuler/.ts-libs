import { assert } from "../utils/assert.util.js";

/**
 * Asserts that a value is defined.
 * @param value - The value to check.
 * @param message - Optional message to display on failure.
 */
export function isDefined<T>(
  value: T | undefined,
  message: string = "Value should be defined",
): asserts value is NonNullable<T> {
  assert(value !== undefined, message);
}
