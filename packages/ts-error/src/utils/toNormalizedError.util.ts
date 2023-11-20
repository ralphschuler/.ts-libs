export const toNormalizedError = (value: unknown): NormalizedError => {
  if (isError(value) || value instanceof CustomError) {
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
