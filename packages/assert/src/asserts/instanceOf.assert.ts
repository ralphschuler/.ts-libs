import { assert } from "../utils/assert.util.js";

/**
 * Asserts that an object is an instance of the specified class.
 * @param object - The object to check.
 * @param constructor - The class to check for.
 * @param message - Optional message to display on failure.
 */
export function instanceOf<T>(
  object: unknown,
  constructor: { new (...args: unknown[]): T },
  message: string = "Object is not an instance of the specified class",
): void {
  assert(object instanceof constructor, message);
}
