import { ISubscription } from "./interfaces/ISubscription.js";
export class SimpleSubscription implements ISubscription {
  private isUnsubscribed = false;
  constructor(private readonly unsubscribeCallback: () => void) {}
  unsubscribe(): void {
    if (this.isUnsubscribed) return;
    this.isUnsubscribed = true;
    this.unsubscribeCallback();
  }
}
