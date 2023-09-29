/**
 * Represents the target state of a transition. It could be another state or void if it ends the state machine.
 * @template State The type of state being transitioned to.
 */
export type TransitionTarget<State> = keyof State | 'void';