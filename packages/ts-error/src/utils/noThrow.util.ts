import { NoThrowResult } from "../types/NoThrowResult.type.js";
import { toNormalizedError } from "./toNormalizedError.util.js";

export const noThrow = <A>(action: () => A): NoThrowResult<A> => {
  try {
    const result = action();
    if (
      result != null &&
      (typeof result === "object" || typeof result === "function") &&
      typeof (result as { then?: unknown }).then === "function"
    ) {
      return Promise.resolve(result).catch(
        toNormalizedError,
      ) as NoThrowResult<A>;
    }
    return result as NoThrowResult<A>;
  } catch (error) {
    return toNormalizedError(error) as NoThrowResult<A>;
  }
};
