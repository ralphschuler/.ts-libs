import { ISubscription } from "./interfaces/ISubscription.js";
import { Logger } from "@lib-lib/logger";

const logger = Logger.getInstance();

/**
 * Represents a simple subscription that can be unsubscribed.
 */
export class SimpleSubscription implements ISubscription {
  private isUnsubscribed = false;

  /**
   * Initializes a new instance of the SimpleSubscription class.
   * @param {() => void} unsubscribeCallback - The callback function to invoke on unsubscribe.
   */
  constructor(private unsubscribeCallback: () => void) {
    logger.debug("Creating subscription...");
  }

  /**
   * Unsubscribes the subscription, invoking the unsubscribe callback if not already unsubscribed.
   */
  unsubscribe(): void {
    logger.debug("Unsubscribing subscription...");
    try {
      if (!this.isUnsubscribed) {
        this.unsubscribeCallback();
        this.isUnsubscribed = true;
      }
    } catch (error) {
      logger.error("Error unsubscribing: " + error);
    }
  }
}
