import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { SimpleSubscription } from './SimpleSubscription'

describe('SimpleSubscription', () => {
  it('should call unsubscribe callback when unsubscribed', () => {
    let unsubscribeCalled = false;
    const subscription = new SimpleSubscription(() => {
      unsubscribeCalled = true;
    });

    subscription.unsubscribe();
    assert.strictEqual(unsubscribeCalled, true);
  });

  it('should prevent multiple calls to unsubscribe callback', () => {
    let unsubscribeCallCount = 0;
    const subscription = new SimpleSubscription(() => {
      unsubscribeCallCount++;
    });

    subscription.unsubscribe();
    subscription.unsubscribe();
    assert.strictEqual(unsubscribeCallCount, 1);
  });

  it('should handle multiple subscriptions with different callbacks', () => {
    let unsubscribeCallCount = 0;
    const subscription1 = new SimpleSubscription(() => {
      unsubscribeCallCount++;
    });
    const subscription2 = new SimpleSubscription(() => {
      unsubscribeCallCount++;
    });

    subscription1.unsubscribe();
    subscription2.unsubscribe();
    assert.strictEqual(unsubscribeCallCount, 2);
  });

  it('should handle multiple subscriptions with the same callback', () => {
    let unsubscribeCallCount = 0;
    const unsubscribeCallback = () => {
      unsubscribeCallCount++;
    };
    const subscription1 = new SimpleSubscription(unsubscribeCallback);
    const subscription2 = new SimpleSubscription(unsubscribeCallback);

    subscription1.unsubscribe();
    subscription2.unsubscribe();
    assert.strictEqual(unsubscribeCallCount, 2);
  });

  it('should handle multiple unsubscribe calls from different sources', () => {
    let unsubscribeCallCount = 0;
    const subscription = new SimpleSubscription(() => {
      unsubscribeCallCount++;
    });

    subscription.unsubscribe();
    subscription.unsubscribe();
    assert.strictEqual(unsubscribeCallCount, 1);
  });

  it('should handle different types of callback functions', () => {
    let unsubscribeCallCount = 0;

    const unsubscribe1 = () => {
      unsubscribeCallCount++;
    };

    const unsubscribe2 = function () {
      unsubscribeCallCount++;
    };

    const subscription1 = new SimpleSubscription(unsubscribe1);
    const subscription2 = new SimpleSubscription(unsubscribe2);

    subscription1.unsubscribe();
    subscription2.unsubscribe();
    assert.strictEqual(unsubscribeCallCount, 2);
  });
});
