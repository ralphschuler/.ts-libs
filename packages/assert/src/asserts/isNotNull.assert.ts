import { assert } from "../utils/assert.util.js";

export function isNotNull<T>(
  value: T | null,
  message: string = "Value should not be null",
): asserts value is NonNullable<T> {
  assert(value !== null, message);
}
