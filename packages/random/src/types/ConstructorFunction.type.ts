/**
 * Constructor function type that takes any number of arguments and returns an instance of T.
 * Args is an array of unknown types for better type safety.
 */
export type ConstructorFunction<
  T = unknown,
  Args extends unknown[] = unknown[],
> = new (...args: Args) => T;
