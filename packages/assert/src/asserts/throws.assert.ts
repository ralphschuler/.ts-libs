import { assert } from "../utils/assert.util.js";

/**
 * Asserts that a function throws an error.
 * @param block - The function to execute.
 * @param message - Optional message to display on failure.
 */
export function throws(
  block: () => void,
  message: string = "Expected function to throw an error",
): void {
  try {
    block();
    assert(false, message);
  } catch {
    assert(true);
  }
}
