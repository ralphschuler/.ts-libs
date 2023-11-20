import { assert } from "../utils/assert.util.js";

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
