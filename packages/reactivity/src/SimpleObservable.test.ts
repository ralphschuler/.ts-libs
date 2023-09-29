import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { SimpleObservable } from './SimpleObservable';
import { map } from './operators/map';
import { filter } from './operators/filter';
import { done } from './operators/done';

describe('SimpleObservable', () => {
  it('should handle error and propagate to subscribers', (done) => {
    const errorMessage = 'Test error';
    const observable = new SimpleObservable<number>((observer) => {
      observer.error(errorMessage);
      return { unsubscribe: () => {} };
    });

    observable.subscribe({
      next: () => {
        done.fail('Next should not be called');
      },
      error: (error) => {
        assert.strictEqual(error, errorMessage);
      },
      complete: () => {
        done.fail('Complete should not be called');
      },
    });
  });

  it('should handle operator transformations', (done) => {
    const observable = new SimpleObservable<number>((observer) => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
      return { unsubscribe: () => {} };
    });

    const expectedValues = [6];
    observable
      .pipe(map((val) => val * 2), filter((val) => val % 3 === 0))
      .subscribe({
        next: (value) => {
          assert.strictEqual(value, expectedValues.shift());
        },
        error: (error) => {
          done.fail('Error should not occur: ' + error);
        },
        complete: () => {
          assert.strictEqual(expectedValues.length, 0);
        },
      });
  });

  it('should unsubscribe from operator chain', () => {
    let unsubscribeCalled = false;
    const subscription = new SimpleObservable<number>((observer) => {
      return { unsubscribe: () => (unsubscribeCalled = true) };
    })
      .pipe(map((val) => val))
      .subscribe({ next: () => {}, error: () => {}, complete: () => {} });

    subscription.unsubscribe();
    assert.strictEqual(unsubscribeCalled, true);
  });

  it('should handle combination of operators', (done) => {
    const observable = new SimpleObservable<number>((observer) => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
      return { unsubscribe: () => {} };
    });

    const expectedValues = [7];
    observable
      .pipe(
        map((val) => val * 2),
        filter((val) => val % 3 === 0),
        map((val) => val + 1)
      )
      .subscribe({
        next: (value) => {
          assert.strictEqual(value, expectedValues.shift());
        },
        error: (error) => {
          done.fail('Error should not occur: ' + error);
        },
        complete: () => {
          assert.strictEqual(expectedValues.length, 0);
        },
      });
  });

  it('should handle complex operator chains', (done) => {
    const observable = new SimpleObservable<number>((observer) => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
      return { unsubscribe: () => {} };
    });

    const expectedValues = [3, 5];
    observable
      .pipe(
        map((val) => val * 2),
        filter((val) => val % 2 === 0),
        map((val) => val - 1),
        filter((val) => val > 2)
      )
      .subscribe({
        next: (value) => {
          assert.strictEqual(value, expectedValues.shift());
        },
        error: (error) => {
          done.fail('Error should not occur: ' + error);
        },
        complete: () => {
          assert.strictEqual(expectedValues.length, 0);
        },
      });
  });
});
