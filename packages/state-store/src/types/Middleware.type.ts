/**
 * Middleware function for state transformations.
 * @template ValueType The type of value the middleware accepts.
 */
export type Middleware<ValueType> = (
  value: ValueType,
  next: () => void,
) => void;
