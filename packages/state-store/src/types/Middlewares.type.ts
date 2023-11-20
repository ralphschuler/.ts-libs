import { Middleware } from "./Middleware.type.js";

/**
 * Type definition for middlewares. Keyed by state property names.
 */
export type Middlewares<StateType> = {
  [Property in keyof StateType]?: Middleware<StateType[Property]>[];
};
