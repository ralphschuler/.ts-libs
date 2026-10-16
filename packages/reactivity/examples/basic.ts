import assert from "node:assert/strict";
import { SimpleObservable, SimpleSubscription, map } from "../src/index.js";
const values: number[] = [];
new SimpleObservable<number>((observer) => {
  observer.next(21);
  observer.complete();
  return new SimpleSubscription(() => {});
})
  .pipe(map((value: number) => value * 2))
  .subscribe({
    next: (value) => values.push(value),
    error: (error) => {
      throw error;
    },
    complete() {},
  });
assert.deepEqual(values, [42]);
