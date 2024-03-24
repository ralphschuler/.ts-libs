import { Interceptor } from "./Interceptor.type.js";

/**
 * This type defines a structure for storing multiple interceptors based on state property names.
 * The `Interceptors` type is an object where each key is a property name from the `StateType` and the value is an optional array of `Interceptor` functions.
 * It is particularly useful in scenarios where you want to apply one or more interceptors to different properties of your state.
 *
 * @template StateType This is the state type whose keys are used to associate interceptors.
 * @property {Interceptor<StateType[Property]>[]} This optional property is an array of `Interceptor` functions associated with each `StateType` property.
 * Its key is derived using `keyof StateType` which provides the set of keys of an object.
 */
export type Interceptors<StateType> = {
  [Property in keyof StateType]?: Interceptor<StateType[Property]>[];
};
