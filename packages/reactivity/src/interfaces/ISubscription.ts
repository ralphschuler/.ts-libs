/**
 * Represents a subscription that can be unsubscribed.
 */
export interface ISubscription {
  /**
   * Unsubscribes the subscription, releasing associated resources.
   */
  unsubscribe: () => void;
}
