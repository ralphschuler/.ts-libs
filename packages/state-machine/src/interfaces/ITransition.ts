import { Action } from "../types/Action.js";
import { Guard } from "../types/Guard.js";
import { TransitionTarget } from "../types/TransitionTarget.js";

/**
 * Represents a transition configuration.
 * @template State The type of state being transitioned to.
 * @template Payload The type of payload accepted by the transition action and guard.
 */
export interface ITransition<State, Payload extends any, Response extends any> {
  target: TransitionTarget<State>; // Target state or void to end the state machine.
  action?: Action<Payload, Response>; // Action to be performed during the transition.
  guard?: Guard<Payload>; // Guard function to determine if the transition is allowed.
}
