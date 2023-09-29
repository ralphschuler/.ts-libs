import { Observer } from "../types/Observer";
import { IOperatorFunction } from "./IOperatorFunction";
import { ISubscription } from "./ISubscription";

/**
 * Represents an observable sequence that can be subscribed to.
 * @template T - The type of value being observed.
 */
export interface IObservable<T> {
  /**
   * Subscribes an observer to the observable sequence.
   * @param {Observer<T>} observer - The observer to be notified.
   * @returns {ISubscription} A subscription that can be used to unsubscribe.
   */
  subscribe: (observer: Observer<T>) => ISubscription;

  /**
   * Applies a series of operator functions to the observable sequence.
   * @param {...IOperatorFunction<any, any>} operators - The operator functions to apply.
   * @returns {IObservableObservable<any>} The new observable sequence after applying the operators.
   */
  pipe: (...operators: IOperatorFunction<any, any>[]) => IObservable<any>;
}
