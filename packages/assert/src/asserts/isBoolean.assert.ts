import { assert } from "../utils/assert.util.js";

export function isBoolean(
  value: any,
  message: string = "Value is not a boolean",
): asserts value is boolean {
  assert(typeof value === "boolean", message);
}
