/**
 * A function that gets called when a state property is updated.
 * @template ValueType The type of value the listener accepts.
 */
export type Listener<ValueType> = (value: ValueType) => void;

/**
 * Middleware function for state transformations.
 * @template ValueType The type of value the middleware accepts.
 */
export type Middleware<ValueType> = (
  value: ValueType,
  next: () => void,
) => void;

/**
 * Interceptor function for modifying state values before they are set.
 * @template ValueType The type of value the interceptor accepts.
 */
export type Interceptor<ValueType> = (value: ValueType) => ValueType;

/**
 * Type definition for listeners. Keyed by state property names.
 */
export type Listeners<StateType> = {
  [Property in keyof StateType]?: Listener<StateType[Property]>[];
};

/**
 * Type definition for middlewares. Keyed by state property names.
 */
export type Middlewares<StateType> = {
  [Property in keyof StateType]?: Middleware<StateType[Property]>[];
};

/**
 * Type definition for interceptors. Keyed by state property names.
 */
export type Interceptors<StateType> = {
  [Property in keyof StateType]?: Interceptor<StateType[Property]>[];
};

/**
 * General type for a state store.
 */
export type StateType<T = any> = StateStore<T>;

/**
 * Type definition for the state store properties.
 */
export type StateStoreProperties = {
  [key: string]: StateType;
};

/**
 * Class responsible for managing application state and notifying listeners about changes.
 * Utilizes Proxy for intercepting state property assignments.
 * @template StateType The type of the state this store will manage.
 */
export class StateStore<StateType extends StateStoreProperties> {
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
      get: (target, property: keyof StateType) => target.state[property],
      set: (target, property: keyof StateType, value: any) => {
        if (typeof value === "function") {
          target.listeners[property] = target.listeners[property] || [];
          target.listeners[property]!.push(
            value as Listener<StateType[keyof StateType]>,
          );
        } else {
          target.updateState(property, value);
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
      this.state[property] = newValue as any;
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

/**
 * Factory function for creating a new StateStore.
 * @template StateType The type of the state to be managed by the store.
 * @param state Initial state of the store.
 * @returns A new StateStore instance.
 */
export const createStateStore = <StateType extends StateStoreProperties>(
  state: StateType,
): StateStore<StateType> => {
  return new StateStore<StateType>(state);
};

// Example Usage
interface User {
  name: string;
  age: number;
}

interface Settings {
  darkMode: boolean;
  notificationsEnabled: boolean;
}

interface NestedState {
  counter: number;
  isActive: boolean;
}

interface AppState {
  user: User;
  settings: Settings;
  nestedState?: StateStore<NestedState>;
}

// Create and manipulate a state store
const appState = createStateStore<AppState>({
  user: { name: "Alice", age: 30 },
  settings: { darkMode: false, notificationsEnabled: true },
  nestedState: createStateStore<NestedState>({
    counter: 0,
    isActive: false,
  }),
});

// Add listener to the state store
appState.user = (newUser: User) => console.log("User updated:", newUser);
appState.settings = (newSettings: Settings) =>
  console.log("Settings updated:", newSettings);

// Update states
appState.user = { name: "Bob", age: 35 };
appState.settings = { darkMode: true, notificationsEnabled: false };

// Update nested states
appState.nestedState!.counter = 10;
appState.nestedState!.isActive = true;
