import { IStateMachine } from "../interfaces/IStateMachine.js";

/**
 * Infer the events from a sub-machine config.
 * @template SubMachineConfig The type of the sub-machine config.
 */
export type InferEventsFromSubMachine<
  SubMachineConfig extends IStateMachine<any, any, any>,
> = SubMachineConfig extends IStateMachine<any, infer Events, any>
  ? Events
  : never;
