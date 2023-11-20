import { Listener } from "./Listener.type.js";

/**
 * Type definition for listeners. Keyed by state property names.
 */
export type Listeners<StateType> = {
  [Property in keyof StateType]?: Listener<StateType[Property]>[];
};
