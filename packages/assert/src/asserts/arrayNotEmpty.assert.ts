import { assert } from "../utils/assert.util.js";

export function arrayNotEmpty<T>(
  array: T[],
  message: string = "Array is empty",
): void {
  assert(array.length > 0, message);
}
