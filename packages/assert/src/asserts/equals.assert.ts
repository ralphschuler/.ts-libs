import { assert } from "../utils/assert.util.js";

export function equals<T>(
  actual: T,
  expected: T,
  message: string = "Values are not equal",
): void {
  assert(actual === expected, message);
}
