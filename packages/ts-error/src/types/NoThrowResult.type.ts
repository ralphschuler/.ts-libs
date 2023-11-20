import { NormalizedError } from "../errors/NormalizedError.error";

export type NoThrowResult<A> = A extends Promise<infer U>
  ? Promise<U | NormalizedError>
  : A | NormalizedError;
