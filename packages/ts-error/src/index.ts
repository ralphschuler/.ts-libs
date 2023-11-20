import { NormalizedError } from "./errors/NormalizedError.error.js";
import { NoThrowResult } from "./types/NoThrowResult.type.js";
import { aggregateErrors } from "./utils/aggregateErrors.util.js";
import { isError } from "./utils/isError.util.js";
import { noThrow } from "./utils/noThrow.util.js";
import { toNormalizedError } from "./utils/toNormalizedError.util.js";

export {
  NormalizedError,
  NoThrowResult,
  aggregateErrors,
  isError,
  noThrow,
  toNormalizedError,
};

export default {
  NormalizedError,
  aggregateErrors,
  isError,
  noThrow,
  toNormalizedError,
};
