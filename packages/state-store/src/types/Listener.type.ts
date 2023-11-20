/**
 * A function that gets called when a state property is updated.
 * @template ValueType The type of value the listener accepts.
 */
export type Listener<ValueType> = (value: ValueType) => void;
