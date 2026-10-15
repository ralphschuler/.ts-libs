export const isError = (value: unknown): value is Error => {
  try {
    return (
      value instanceof Error ||
      (!!value &&
        typeof value === "object" &&
        "message" in value &&
        typeof value.message === "string")
    );
  } catch {
    return false;
  }
};
