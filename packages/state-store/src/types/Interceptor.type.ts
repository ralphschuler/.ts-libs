/**
 * Interceptor function for modifying state values before they are set.
 * @template ValueType The type of value the interceptor accepts.
 */
export type Interceptor<ValueType> = (value: ValueType) => ValueType;
