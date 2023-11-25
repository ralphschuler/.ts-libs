import { Logger } from "@ralphschuler/logger";
import { IStateConfig } from "./interfaces/IStateConfig.js";
import { IStateMachine } from "./interfaces/IStateMachine.js";
import { Action } from "./types/Action.js";
import { Guard } from "./types/Guard.js";
import { InferEventsFromSubMachine } from "./types/InferEventsFromSubMachine.js";
import { Merge } from "./types/Merge.js";
import { StateChangedObserver } from "./types/StateChangeObserver.js";

const logger = Logger.getInstance();

/**
 * Represents a base implementation of a state machine.
 * @template States The type of states in the state machine.
 * @template Events The type of events that can trigger transitions.
 * @template Payloads The type of payloads associated with states and transitions.
 */
export class StateMachine<
  States extends Record<keyof States, any>,
  Events extends Record<keyof Events, any>,
  Payloads extends Merge<[States, Events]>,
> implements IStateMachine<States, Events, Payloads>
{
  private currentState: keyof States;
  private config: Record<
    keyof States,
    IStateConfig<
      States,
      Events,
      Payloads,
      InferEventsFromSubMachine<IStateMachine<any, any, any>>
    >
  >;
  private observers: StateChangedObserver<States, Payloads>[] = [];
  private subMachineInstances: Record<string, StateMachine<any, any, any>> = {};

  /**
   * Initializes a base state machine.
   * @param initialState The initial state of the state machine.
   * @param config Configuration for state transitions and actions.
   */
  constructor(
    initialState: keyof States,
    config?: Record<
      keyof States,
      IStateConfig<
        States,
        Events,
        Payloads,
        InferEventsFromSubMachine<IStateMachine<any, any, any>>
      >
    >,
  ) {
    this.currentState = initialState;
    this.config =
      config ||
      ({} as Record<
        keyof States,
        IStateConfig<
          States,
          Events,
          Payloads,
          InferEventsFromSubMachine<IStateMachine<any, any, any>>
        >
      >);
  }

  /**
   * Adds a transition to the state machine.
   * @param from The state from which the transition originates.
   * @param to The state to which the transition leads.
   * @param event The event that triggers the transition.
   * @param action Optional The action to execute on transition.
   * @param guard Optional The guard to check before executing the transition.
   * @param subMachine Optional sub-machine configuration.
   * @returns The updated state machine.
   */
  public addTransition<
    From extends keyof States,
    Event extends keyof Events,
    To extends keyof States,
    SubMachineEvents extends Record<keyof SubMachineEvents, any>,
  >(
    from: From,
    event: Event,
    to: To,
    action?: Action<Payloads[keyof Payloads], any>,
    guard?: Guard<Payloads[keyof Payloads]>,
    subMachine?: IStateMachine<any, SubMachineEvents, any>,
  ): StateMachine<
    Merge<[States, Record<From, any>, Record<To, any>]>,
    Events,
    Payloads
  > {
    try {
      Object.assign(this.config, {
        [from]: Object.assign(this.config[from] || {}, {
          on: Object.assign(this.config[from]?.on || {}, {
            [event]: Object.assign(this.config[from]?.on?.[event] || {}, {
              target: to,
              action,
              guard,
              subMachine,
            }),
          }),
        }),
      });

      return this;
    } catch (error) {
      logger.error("Error adding transition: " + error);
      throw error;
    }
  }

  /**
   * Triggers a transition in the state machine.
   * @param event The event that triggers the transition.
   * @param payload Optional payload for the transition.
   * @returns The updated state machine after the transition.
   */
  public async transition(
    event:
      | keyof Events
      | InferEventsFromSubMachine<IStateMachine<any, any, any>>,
    payload?: Payloads[keyof States],
  ): Promise<IStateMachine<States, Events, Payloads>> {
    try {
      const stateConfig = this.config[this.currentState];
      const transitionConfig = stateConfig?.on && stateConfig?.on[event];

      if (!transitionConfig) {
        return this;
      }

      if (transitionConfig.guard && !transitionConfig.guard(payload)) {
        if (stateConfig.onError) {
          await stateConfig.onError(payload);
        }
        return this;
      }

      const prevState = this.currentState;
      this.currentState = transitionConfig.target as keyof States;

      if (prevState && stateConfig.onExit) {
        await stateConfig.onExit(payload);
      }

      if (stateConfig.onEntry) {
        await stateConfig.onEntry(payload);
      }

      let transitionResponse: any;
      if (transitionConfig.action) {
        transitionResponse = await transitionConfig.action(payload);
      }

      this.notifyObservers(this.currentState, prevState, payload);

      // Handle sub-machine transitions
      if (stateConfig.subMachine) {
        await stateConfig.subMachine.transition(event, payload);
      }

      if (transitionConfig.action) {
        return await this.transition(
          transitionConfig.target,
          transitionResponse,
        );
      }

      return this;
    } catch (error) {
      logger.error("Error transitioning: " + error);
      throw error;
    }
  }

  /**
   * Registers an observer for state changes.
   * @param observer The observer function.
   */
  public subscribe(observer: StateChangedObserver<States, Payloads>): void {
    this.observers.push(observer);
  }

  /**
   * Checks if the current state is a terminal state.
   * @returns True if the current state is terminal, false otherwise.
   */
  public isInEndState(): boolean {
    return this.config[this.currentState]?.on?.default?.target === undefined;
  }

  /**
   * Retrieves the current state of the state machine.
   * @returns The current state of the state machine.
   */
  public getCurrentState(): keyof States {
    return this.currentState;
  }

  private notifyObservers(
    newState: keyof States,
    prevState: keyof States,
    payload?: Payloads[keyof States],
  ): void {
    try {
      this.observers.forEach((observer) =>
        observer(newState, prevState, payload),
      );
    } catch (error) {
      logger.error("Error notifying observers: " + error);
      throw error;
    }
  }
}
