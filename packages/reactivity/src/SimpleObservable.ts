import { SimpleSubscription } from "./SimpleSubscription.js";
import { IObservable } from "./interfaces/IObservable.js";
import { IOperatorFunction } from "./interfaces/IOperatorFunction.js";
import { ISubscription } from "./interfaces/ISubscription.js";
import { Observer } from "./types/Observer.js";

/** Cold source: every subscriber owns independent termination and teardown. */
export class SimpleObservable<T> implements IObservable<T> {
  constructor(
    private readonly subscribeFunction: (
      observer: Observer<T>,
    ) => ISubscription,
  ) {}
  subscribe(observer: Observer<T>): ISubscription {
    let active = true;
    let upstream: ISubscription | undefined;
    let cleaned = false;
    const cleanup = () => {
      if (upstream && !cleaned) {
        cleaned = true;
        upstream.unsubscribe();
      }
    };
    const subscription = new SimpleSubscription(() => {
      active = false;
      cleanup();
    });
    const terminal = (kind: "error" | "complete", error?: unknown) => {
      if (!active) return;
      active = false;
      try {
        if (kind === "error") observer.error(error);
        else observer.complete();
      } finally {
        cleanup();
      }
    };
    try {
      upstream = this.subscribeFunction({
        next: (value) => {
          if (active) observer.next(value);
        },
        error: (error) => terminal("error", error),
        complete: () => terminal("complete"),
      });
      if (!active) cleanup();
    } catch (error) {
      terminal("error", error);
    }
    return subscription;
  }
  pipe(...operators: IOperatorFunction<any, any>[]): IObservable<any> {
    return operators.reduce(
      (previous, operator) => operator(previous),
      this as IObservable<any>,
    );
  }
}
