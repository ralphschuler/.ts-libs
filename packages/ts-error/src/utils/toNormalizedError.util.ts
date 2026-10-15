import { NormalizedError } from "../errors/NormalizedError.error.js";
export const toNormalizedError = (value: unknown): NormalizedError => {
  let message = "Unprintable thrown value";
  let stack: string | undefined;
  try {
    if (value instanceof NormalizedError) return value;
    if (value instanceof Error) {
      message = value.message;
      stack = value.stack;
    } else if (typeof value === "string") message = value;
    else {
      const encoded = JSON.stringify(value);
      message = encoded ?? String(value);
    }
  } catch {
    /* Hostile or cyclic values still produce a usable error. */
  }
  const error = new Error(message);
  if (stack) error.stack = stack;
  return new NormalizedError(error, value);
};
