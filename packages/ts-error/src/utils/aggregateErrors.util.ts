import { NormalizedError } from "../errors/NormalizedError.error";

export const aggregateErrors = (errors: Error[]): NormalizedError => {
  const aggregatedMessage = errors.map((e) => e.message).join(", ");
  return new NormalizedError(new Error(aggregatedMessage));
};
