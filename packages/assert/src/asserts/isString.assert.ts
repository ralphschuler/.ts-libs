import { assert } from "../utils/assert.util.js";

export function isString(
  value: unknown,
  message: string = "Value is not a string",
): asserts value is string {
  assert(typeof value === "string", message);
}
