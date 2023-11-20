import { Interceptor } from "./Interceptor.type.js";

/**
 * Type definition for interceptors. Keyed by state property names.
 */
export type Interceptors<StateType> = {
  [Property in keyof StateType]?: Interceptor<StateType[Property]>[];
};
