/**
 * Represents a function that compares two values and returns a numeric result.
 * @template T The type of values being compared.
 */
export type ComparatorFunction<T> = (a: T, b: T) => Promise<number>;
