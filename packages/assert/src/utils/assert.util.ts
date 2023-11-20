import { AssertionError } from "../errors/AssertionError.error";

export function assert(
  condition: boolean,
  message: string = "Assertion failed",
): asserts condition {
  if (!condition) {
    throw new AssertionError(message);
  }
}
