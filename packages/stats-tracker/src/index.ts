// Event Type and Payload Mapping
interface EventPayloadMap {
  enqueue: { data: string }; // Example payload for enqueue event
  dequeue: { itemId: number }; // Example payload for dequeue event
}

// Generic Event Type
type Event<T extends keyof EventPayloadMap> = {
  timestamp: Date;
  type: T;
  payload: EventPayloadMap[T];
};

// Event Logger Interface
interface IEventLogger<T extends keyof EventPayloadMap> {
  logEvent(type: T, payload: EventPayloadMap[T]): void;
}

// Event Statistics Interface
interface IEventStatistics<T extends keyof EventPayloadMap> {
  getCount(type: T): number;
  getRatePerMinute(type: T): number;
}

// StatsTracker Class Implementing Both Interfaces
class StatsTracker<T extends keyof EventPayloadMap> implements IEventLogger<T>, IEventStatistics<T> {
  private events: Event<T>[] = [];

  logEvent(type: T, payload: EventPayloadMap[T]): void {
      this.events.push({ timestamp: new Date(), type, payload });
      this.cleanup();
  }

  getCount(type: T): number {
      return this.events.filter(event => event.type === type).length;
  }

  getRatePerMinute(type: T): number {
      const oneMinuteAgo = new Date(Date.now() - 60000);
      return this.events.filter(event => event.type === type && event.timestamp > oneMinuteAgo).length;
  }

  private cleanup(): void {
      const oneMinuteAgo = new Date(Date.now() - 60000);
      this.events = this.events.filter(event => event.timestamp > oneMinuteAgo);
  }
}

// Usage example
const tracker = new StatsTracker<'enqueue' | 'dequeue'>();
tracker.logEvent('enqueue', { data: 'Item1' });
tracker.logEvent('dequeue', { itemId: 123 });

console.log('Enqueue count:', tracker.getCount('enqueue')); // Outputs: 1
console.log('Dequeue count:', tracker.getCount('dequeue')); // Outputs: 0
console.log('Enqueue rate:', tracker.getRatePerMinute('enqueue')); // Outputs rate per minute
