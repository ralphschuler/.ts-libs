import { assert } from "../utils/assert.util.js";

export function greaterThan(
  actual: number,
  expected: number,
  message: string = "Value is not greater than expected",
): void {
  assert(actual > expected, message);
}
