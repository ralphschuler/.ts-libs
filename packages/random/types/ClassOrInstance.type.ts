import { ConstructorFunction } from "./ConstructorFunction.type";
import { ConstructorParametersOf } from "./ConstructorParametersOf.type";

/**
 * Type that can either be a class constructor or an instance of that class,
 * with constructor arguments automatically inferred.
 * Restricts to only allow class types.
 */
export type ClassOrInstance<T> = T extends object ? (T | ConstructorFunction<T, ConstructorParametersOf<ConstructorFunction<T>>>) : never;