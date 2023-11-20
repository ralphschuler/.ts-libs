import { assert } from "../utils/assert.util.js";

export function notEquals<T>(
  actual: T,
  expected: T,
  message: string = "Values are equal",
): void {
  assert(actual !== expected, message);
}
