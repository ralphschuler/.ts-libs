import { assert } from "../utils/assert.util.js";

/**
 * Asserts that a value is not null.
 * @param value - The value to check.
 * @param message - Optional message to display on failure.
 */
export function isNotNull<T>(
  value: T | null,
  message: string = "Value should not be null",
): asserts value is NonNullable<T> {
  assert(value !== null, message);
}
