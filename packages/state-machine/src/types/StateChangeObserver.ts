import { Merge } from "./Merge.js";

/**
 * Observer for state changes. It gets notified of both the new state and the previous state.
 * @template States The type of states in the state machine.
 * @template Payloads The type of payloads associated with the state changes.
 */
export type StateChangedObserver<
  States extends Record<keyof States, any>,
  Payloads extends Merge<[States]>,
> = (
  newState: keyof States,
  prevState: keyof States,
  payload?: Payloads[keyof States], // Payload associated with the state change.
) => void;
