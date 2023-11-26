import { assert } from "../utils/assert.util.js";

/**
 * Asserts that a value is a number.
 * @param value - The value to check.
 * @param message - Optional message to display on failure.
 */
export function isNumber(
  value: unknown,
  message: string = "Value is not a number",
): asserts value is number {
  assert(typeof value === "number", message);
}
