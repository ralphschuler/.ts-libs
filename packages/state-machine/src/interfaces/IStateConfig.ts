import { StateMachine } from "../StateMachine.js";
import { Action } from "../types/Action.js";
import { Merge } from "../types/Merge.js";
import { ITransition } from "./ITransition.js";

/**
 * Represents a configuration for a state in the state machine.
 * @template States The type of states in the state machine.
 * @template Events The type of events that can trigger transitions.
 * @template Payloads The type of payloads accepted by actions and guards.
 * @template SubMachineEvents The type of events specific to sub-machines.
 */
export interface IStateConfig<
  States extends Record<string, any>,
  Events extends Record<string, any>,
  Payloads extends Merge<[States, Events]>,
  SubMachineEvents extends Record<keyof SubMachineEvents, any>,
> {
  /** Action executed when entering this state. */
  onEntry?: Action<Payloads[keyof Payloads], any>;

  /** Action executed when exiting this state. */
  onExit?: Action<Payloads[keyof Payloads], any>;

  /** Action executed on transition error. */
  onError?: Action<any, any>;

  /** Transition configurations based on events. */
  on?: {
    [event in keyof Events | keyof SubMachineEvents]?: ITransition<
      States,
      Payloads[keyof Payloads],
      any
    >;
  };

  /** Configuration for sub-machine within this state. */
  subMachine?: StateMachine<any, SubMachineEvents, any>;
}
