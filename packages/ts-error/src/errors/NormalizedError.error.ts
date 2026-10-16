export class NormalizedError extends Error {
  originalValue: unknown;
  timestamp: string;
  environment: string;

  constructor(error: Error, originalValue?: unknown) {
    super(error.message);
    this.name = "NormalizedError";
    this.stack = error.stack;
    this.originalValue = originalValue;
    this.timestamp = new Date().toISOString();
    this.environment =
      typeof process === "undefined"
        ? "browser"
        : process.env.NODE_ENV || "development";
  }
}
