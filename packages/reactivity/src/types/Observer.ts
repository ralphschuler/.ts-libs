/**
 * Represents an observer with methods to handle different notification types.
 * @template T - The type of value being observed.
 */
export type Observer<T> = {
  /**
   * Handles the next value in the sequence.
   * @param {T} value - The next value in the sequence.
   */
  next: (value: T) => void;

  /**
   * Handles an error in the sequence.
   * @param {any} error - The error that occurred.
   */
  error: (error: any) => void;

  /**
   * Handles the completion of the sequence.
   */
  complete: () => void;
};
