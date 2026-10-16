import { NormalizedError } from "../errors/NormalizedError.error.js";

export type NoThrowResult<A> =
  A extends PromiseLike<infer U>
    ? Promise<U | NormalizedError>
    : A | NormalizedError;
