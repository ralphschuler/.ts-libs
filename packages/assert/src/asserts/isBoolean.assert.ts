import { assert } from "../utils/assert.util.js";

/**
 * Asserts that a value is a boolean.
 * @param value - The value to check.
 * @param message - Optional message to display on failure.
 */
export function isBoolean(
  value: unknown,
  message: string = "Value is not a boolean",
): asserts value is boolean {
  assert(typeof value === "boolean", message);
}
