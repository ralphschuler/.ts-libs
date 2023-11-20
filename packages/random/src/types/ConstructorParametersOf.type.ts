import { ConstructorFunction } from './ConstructorFunction.type';

/**
 * Extracts the constructor parameter types of a constructor function.
 * Utilizes conditional types to ensure T is a constructor.
 */
export type ConstructorParametersOf<T> = T extends ConstructorFunction<unknown, infer Args> ? Args : never;
