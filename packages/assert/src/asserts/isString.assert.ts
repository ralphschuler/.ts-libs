import { assert } from "../utils/assert.util.js";

/**
 * Asserts that a value is a string.
 * @param value - The value to check.
 * @param message - Optional message to display on failure.
 */
export function isString(
  value: unknown,
  message: string = "Value is not a string",
): asserts value is string {
  assert(typeof value === "string", message);
}
