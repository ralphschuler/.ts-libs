import { StateStore } from "../StateStore.js";
import { StateProperties } from "../types/StateProperties.type.js";
/**
 * Factory function for creating a new StateStore.
 * @template StateType The type of the state to be managed by the store.
 * @param state Initial state of the store.
 * @returns A new StateStore instance.
 */
export const createStateStore = <StateType extends StateProperties>(
  state: StateType,
): StateStore<StateType> => {
  return new StateStore<StateType>(state);
};
