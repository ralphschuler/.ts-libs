import { NormalizedError } from "../errors/NormalizedError.error.js";

export type NoThrowResult<A> =
  A extends Promise<infer U>
    ? Promise<U | NormalizedError>
    : A | NormalizedError;
