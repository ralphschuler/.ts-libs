export class SafeArray<T> {
  private array: Array<T>;
  private addQueue: Array<T>;
  private removeQueue: Array<T>;

  public constructor(items?: Array<T>) {
    this.array = items || [];
    this.addQueue = [];
    this.removeQueue = [];
  }

  public get isEmpty(): boolean {
    return this.array.length + this.addQueue.length === 0;
  }

  public get length(): number {
    return this.array.length + this.addQueue.length - this.removeQueue.length;
  }

  public add(item: T): void {
    this.addQueue.push(item);
  }

  public remove(item: T): void {
    this.removeQueue.push(item);
  }

  public filter(predicate: (item: T) => boolean): Array<T> {
    const result: Array<T> = [];
    this.forEach((item: T) => {
      if (predicate(item)) {
        result.push(item);
      }
    });
    return result;
  }

  public forEach(callback: (item: T) => void): void {
    this.addQueued();
    this.removeQueued();
    for (const item of this.array) {
      if (this.removeQueue.indexOf(item) === -1) {
        callback(item);
      }
    }
    this.removeQueued();
  }

  private addQueued(): void {
    this.array = this.array.concat(this.addQueue);
  }

  private removeQueued(): void {
    this.array = this.array.filter(
      (item: T) => !this.removeQueue.includes(item),
    );
    this.removeQueue = [];
  }
}
