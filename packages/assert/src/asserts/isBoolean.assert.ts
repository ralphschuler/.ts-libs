import { assert } from "../utils/assert.util.js";

export function isBoolean(
  value: unknown,
  message: string = "Value is not a boolean",
): asserts value is boolean {
  assert(typeof value === "boolean", message);
}
