import { StateStore } from "../StateStore.js";
import { StateProperties } from "./StateProperties.type.js";

/**
 * General type for a state store.
 */
export type StateType = StateStore<StateProperties>["state"];
