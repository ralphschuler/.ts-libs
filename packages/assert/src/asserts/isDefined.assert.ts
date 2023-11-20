import { assert } from "../utils/assert.util.js";

export function isDefined<T>(
  value: T | undefined,
  message: string = "Value should be defined",
): asserts value is NonNullable<T> {
  assert(value !== undefined, message);
}
