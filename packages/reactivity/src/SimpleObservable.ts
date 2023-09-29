import { SimpleSubscription } from "./SimpleSubscription";
import { IObservable } from "./interfaces/IObservable";
import { IOperatorFunction } from "./interfaces/IOperatorFunction";
import { ISubscription } from "./interfaces/ISubscription";
import { Observer } from "./types/Observer";
import { Logger } from "../Logger/Logger";

const logger = Logger.getInstance();

/**
 * Represents a simple observable sequence that can be subscribed to.
 * @template T - The type of value being observed.
 */
export class SimpleObservable<T> implements IObservable<T> {
  private subscribers: Observer<T>[] = [];
  private isComplete = false;
  private isErrored = false;
  private error: any;
  private isUnsubscribed = false;

  /**
   * Initializes a new instance of the SimpleObservable class.
   * @param {(observer: Observer<T>) => ISubscription} subscribeFunction - The subscription logic.
   */
  constructor(
    private subscribeFunction: (observer: Observer<T>) => ISubscription
  ) {
    logger.debug("Creating observable...");
  }

  /**
   * Subscribes an observer to the observable sequence.
   * @param {Observer<T>} observer - The observer to be subscribed.
   * @returns {ISubscription} A subscription that can be used to unsubscribe.
   */
  subscribe(observer: Observer<T>): ISubscription {
    logger.debug("Subscribing observer...");
    try {
      if (this.isComplete) {
        observer.complete();
        return new SimpleSubscription(() => {});
      }

      if (this.isErrored) {
        observer.error(this.error);
        return new SimpleSubscription(() => {});
      }

      this.subscribers.push(observer);

      const subscription = this.subscribeFunction({
        next: (value: T) => {
          if (!this.isUnsubscribed) {
            observer.next(value);
          }
        },
        error: (error: any) => {
          if (!this.isUnsubscribed) {
            this.isErrored = true;
            this.error = error;
            this.subscribers.forEach((sub) => sub.error(error));
          }
        },
        complete: () => {
          if (!this.isUnsubscribed) {
            this.isComplete = true;
            this.subscribers.forEach((sub) => sub.complete());
          }
        },
      });

      return new SimpleSubscription(() => {
        this.isUnsubscribed = true;
        this.subscribers = this.subscribers.filter((sub) => sub !== observer);
        subscription.unsubscribe();
      });
    } catch (error) {
      logger.error("Failed subscribing: " + error);
    }
  }

  /**
   * Applies a series of operator functions to the observable sequence.
   * @param {...IOperatorFunction<any, any>} operators - The operator functions to apply.
   * @returns {IObservable<any>} The new observable sequence after applying the operators.
   */
  pipe(...operators: IOperatorFunction<any, any>[]): IObservable<any> {
    logger.debug("Piping observable...");
    try {
      if (operators.length === 0) {
        return this;
      }
  
      return operators.reduce(
        (prevObservable, operator) => operator(prevObservable),
        this as any
      );
    } catch (error) {
      logger.error("Failed piping operators: " + error);
    }
  }
}
