import { assert } from "../utils/assert.util.js";

export function instanceOf<T>(
  object: any,
  constructor: { new (...args: any[]): T },
  message: string = "Object is not an instance of the specified class",
): void {
  assert(object instanceof constructor, message);
}
