import { assert } from "../utils/assert.util.js";

export function lessThan(
  actual: number,
  expected: number,
  message: string = "Value is not less than expected",
): void {
  assert(actual < expected, message);
}
