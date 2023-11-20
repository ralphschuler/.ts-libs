import { NoThrowResult } from "../types/NoThrowResult.type";
import { toNormalizedError } from "./toNormalizedError.util";

export const noThrow = <A>(action: () => A): NoThrowResult<A> => {
  try {
    const result = action();
    if (result instanceof Promise) {
      return result.catch(toNormalizedError) as NoThrowResult<A>;
    }
    return result as NoThrowResult<A>;
  } catch (error) {
    return toNormalizedError(error) as NoThrowResult<A>;
  }
};
