/**
 * This type defines an interceptor function for modifying state values before they are stored.
 * An interceptor function accepts an initial state value and returns a potentially modified state value.
 * The function has a single parameter: `value` of generic type `ValueType`.
 * It is designed to modify `ValueType` values before they are set to the state.
 *
 * @template ValueType The type of value accepted by the interceptor. It serves as an input type for the interception function and also as its return type.
 * @param {ValueType} value The initial state value which can be modified by the interceptor function.
 * @returns {ValueType} Returns the potentially modified state value.
 */
export type Interceptor<ValueType> = (value: ValueType) => ValueType;
