// errorHandling.ts

// Type guard to check if a value is an Error
export const isError = (value: unknown): value is Error =>
  !!value &&
  typeof value === 'object' &&
  'message' in value &&
  typeof value.message === 'string' &&
  'stack' in value &&
  typeof value.stack === 'string';

// Base class for custom errors
export class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomError';
  }
}

// NormalizedError class to handle unknown values with detailed logging
export class NormalizedError extends Error {
  originalValue: unknown;
  timestamp: string;
  environment: string;

  constructor(error: Error, originalValue?: unknown) {
    super(error.message);
    this.name = 'NormalizedError';
    this.stack = error.stack;
    this.originalValue = originalValue;
    this.timestamp = new Date().toISOString();
    this.environment = process.env.NODE_ENV || 'development';
  }
}

// Function to convert unknown values into NormalizedError
export const toNormalizedError = (value: unknown): NormalizedError => {
  if (isError(value) || value instanceof CustomError) {
    return new NormalizedError(value);
  } else {
    const newError = new Error(
      `Unexpected value thrown: ${
        typeof value === 'object' ? JSON.stringify(value) : String(value)
      }`
    );
    return new NormalizedError(newError, value);
  }
};

// Type for noThrow result, supporting both sync and async operations
type NoThrowResult<A> = A extends Promise<infer U>
  ? Promise<U | NormalizedError>
  : A | NormalizedError;

// noThrow function with async support
export const noThrow = <A>(action: () => A): NoThrowResult<A> => {
  try {
    const result = action();
    if (result instanceof Promise) {
      return result.catch(toNormalizedError) as NoThrowResult<A>;
    }
    return result as NoThrowResult<A>;
  } catch (error) {
    return toNormalizedError(error) as NoThrowResult<A>;
  }
};

// Function to aggregate multiple errors
export const aggregateErrors = (errors: Error[]): NormalizedError => {
  const aggregatedMessage = errors.map(e => e.message).join(', ');
  return new NormalizedError(new Error(aggregatedMessage));
};
