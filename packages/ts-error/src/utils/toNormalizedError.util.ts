import { NormalizedError } from "../errors/NormalizedError.error.js";
import { isError } from "./isError.util.js";

export const toNormalizedError = (value: unknown): NormalizedError => {
  if (isError(value)) {
    return new NormalizedError(value);
  } else {
    const newError = new Error(
      `Unexpected value thrown: ${
        typeof value === "object" ? JSON.stringify(value) : String(value)
      }`,
    );
    return new NormalizedError(newError, value);
  }
};
