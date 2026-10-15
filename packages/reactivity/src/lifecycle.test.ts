import assert from "node:assert/strict";
import { it } from "node:test";
import { SimpleObservable } from "./SimpleObservable.js";
import type { Observer } from "./types/Observer.js";
it("isolates subscribers and tears down exactly once after synchronous completion", () => {
  const observers: Observer<number>[] = [];
  let cleanups = 0;
  const source = new SimpleObservable<number>((observer) => {
    observers.push(observer);
    return {
      unsubscribe() {
        cleanups++;
      },
    };
  });
  const a: number[] = [];
  const b: number[] = [];
  const first = source.subscribe({
    next: (value) => a.push(value),
    error() {},
    complete() {},
  });
  source.subscribe({
    next: (value) => b.push(value),
    error() {},
    complete() {},
  });
  first.unsubscribe();
  observers[0].next(1);
  observers[1].next(2);
  assert.deepEqual(a, []);
  assert.deepEqual(b, [2]);
  observers[1].complete();
  observers[1].next(3);
  assert.deepEqual(b, [2]);
  assert.equal(cleanups, 2);
  let synchronous = 0;
  const terminal = new SimpleObservable<number>((observer) => {
    observer.complete();
    return {
      unsubscribe() {
        synchronous++;
      },
    };
  });
  const subscription = terminal.subscribe({
    next() {},
    error() {},
    complete() {},
  });
  subscription.unsubscribe();
  assert.equal(synchronous, 1);
});
