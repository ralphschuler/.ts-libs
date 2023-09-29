import { Merge } from "../types/Merge.js";
import { StateChangedObserver } from "../types/StateChangeObserver.js";

/**
 * Represents a state machine.
 * @template States The type of states in the state machine.
 * @template Events The type of events that can trigger transitions.
 * @template Payloads The type of payloads accepted by actions and guards.
 */
export interface IStateMachine<
  States extends Record<string, any>,
  Events extends Record<string, any>,
  Payloads extends Merge<[States, Events]>,
> {
  /**
   * Triggers a transition in the state machine.
   * @param event The event that triggers the transition.
   * @param payload Optional payload for the transition.
   * @returns The updated state machine after the transition.
   */
  transition(
    event: keyof Events,
    payload?: Payloads[keyof Payloads],
  ): Promise<IStateMachine<States, Events, Payloads>>;

  /**
   * Registers an observer for state changes.
   * @param observer The observer function.
   */
  subscribe(observer: StateChangedObserver<States, Payloads>): void;

  /**
   * Checks if the current state is a terminal state.
   * @returns True if the current state is terminal, false otherwise.
   */
  isInEndState(): boolean;

  /**
   * Retrieves the current state of the state machine.
   * @returns The current state of the state machine.
   */
  getCurrentState(): keyof States;
}
