import { Interceptors } from "./types/Interceptors.type.js";
import { Listener } from "./types/Listener.type.js";
import { Listeners } from "./types/Listeners.type.js";
import { Middlewares } from "./types/Middlewares.type.js";
import { StateProperties } from "./types/StateProperties.type.js";

/**
 * Class responsible for managing application state and notifying listeners about changes.
 * Utilizes Proxy for intercepting state property assignments.
 * @template StateType The type of the state this store will manage.
 */
export class StateStore<StateType extends StateProperties> {
  protected state: StateType;
  protected listeners: Listeners<StateType> = {};
  protected middlewares: Middlewares<StateType> = {};
  protected interceptors: Interceptors<StateType> = {};

  /**
   * Initializes a new StateStore instance.
   * @param state The initial state of the store.
   */
  constructor(state: StateType) {
    this.state = state;
    return this.createProxy();
  }

  /**
   * Creates a proxy to handle get and set operations transparently.
   * @returns A proxy wrapped instance of the StateStore.
   */
  private createProxy(): StateStore<StateType> {
    return new Proxy(this, {
      get: (target, property: string | symbol) =>
        target.state[property as keyof StateType],
      set: (target, property: string | symbol, value: unknown): boolean => {
        if (typeof value === "function") {
          target.listeners[property as keyof StateType] =
            target.listeners[property as keyof StateType] || [];
          target.listeners[property as keyof StateType]!.push(
            value as Listener<StateType[keyof StateType]>,
          );
        } else {
          target.updateState(
            property as keyof StateType,
            value as StateType[keyof StateType],
          );
        }
        return true;
      },
    });
  }

  /**
   * Updates the state for a given property and notifies the relevant listeners.
   * Applies interceptors and middlewares before updating the state.
   * @template PropertyKey The key of the property to be updated.
   * @param property The property to update.
   * @param value The new value for the property.
   */
  private updateState<PropertyKey extends keyof StateType>(
    property: PropertyKey,
    value: StateType[PropertyKey],
  ): void {
    const newValue = this.applyInterceptors(property, value);
    this.applyMiddlewares(property, newValue, () => {
      this.state[property as keyof StateType] = newValue;
      this.notifyListeners(property, newValue);
    });
  }

  /**
   * Applies interceptors for a given property.
   * @template PropertyKey The key of the property for which interceptors are to be applied.
   * @param property The property for which interceptors should be applied.
   * @param value The value to be passed through interceptors.
   * @returns The value after passing through all interceptors.
   */
  private applyInterceptors<PropertyKey extends keyof StateType>(
    property: PropertyKey,
    value: StateType[PropertyKey],
  ): StateType[PropertyKey] {
    return (
      this.interceptors[property]?.reduce(
        (acc, interceptor) => interceptor(acc),
        value,
      ) ?? value
    );
  }

  /**
   * Applies middlewares for a given property.
   * @template PropertyKey The key of the property for which middlewares are to be applied.
   * @param property The property for which middlewares should be applied.
   * @param value The value to be passed through middlewares.
   * @param next The callback to invoke after all middlewares have been applied.
   */
  private applyMiddlewares<PropertyKey extends keyof StateType>(
    property: PropertyKey,
    value: StateType[PropertyKey],
    next: () => void,
  ): void {
    const middlewares = this.middlewares[property];
    if (!middlewares) {
      next();
      return;
    }

    const invokeMiddleware = (index: number) => {
      if (index >= middlewares.length) {
        next();
        return;
      }
      middlewares[index](value, () => invokeMiddleware(index + 1));
    };

    invokeMiddleware(0);
  }

  /**
   * Notifies all listeners about a change in state for a given property.
   * @template PropertyKey The key of the property for which listeners are to be notified.
   * @param property The property that has changed.
   * @param value The new value of the property.
   */
  protected notifyListeners<PropertyKey extends keyof StateType>(
    property: PropertyKey,
    value: StateType[PropertyKey],
  ): void {
    this.listeners[property]?.forEach((listener) => listener(value));
  }
}
