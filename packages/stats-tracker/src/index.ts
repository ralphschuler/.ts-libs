export interface EventPayloadMap {
  enqueue: { data: string };
  dequeue: { itemId: number };
}
/** getCount is a sliding-window count, never a lifetime total. */
export class StatsTracker<T extends string = keyof EventPayloadMap> {
  private events: { time: number; type: T; payload: unknown }[] = [];
  constructor(
    private readonly clock: () => number = () => performance.now(),
    private readonly windowMs = 60_000,
  ) {
    if (!Number.isFinite(windowMs) || windowMs <= 0)
      throw new RangeError("windowMs must be positive");
  }
  private cleanup(): void {
    const cutoff = this.clock() - this.windowMs;
    this.events = this.events.filter((event) => event.time > cutoff);
  }
  logEvent(type: T, payload: unknown): void {
    this.cleanup();
    this.events.push({ time: this.clock(), type, payload });
  }
  getCount(type: T): number {
    this.cleanup();
    return this.events.filter((event) => event.type === type).length;
  }
  getRatePerMinute(type: T): number {
    return (this.getCount(type) * 60_000) / this.windowMs;
  }
}
