type NumericEnum = Record<string, number>;

class BitwiseFeatureFlags<T extends NumericEnum> {
  private flags: number;
  private validFlags: Set<number>;

  constructor(validFlags: T) {
    this.flags = 0;
    this.validFlags = new Set(Object.values(validFlags));
  }

  private isValidFlag(flag: number): boolean {
    return this.validFlags.has(flag);
  }

  enableFlag(flag: T[keyof T]): void {
    if (!this.isValidFlag(flag)) {
      console.error("Invalid flag:", flag);
      return;
    }
    this.flags |= flag;
  }

  disableFlag(flag: T[keyof T]): void {
    if (!this.isValidFlag(flag)) {
      console.error("Invalid flag:", flag);
      return;
    }
    this.flags &= ~flag;
  }

  isFlagEnabled(flag: T[keyof T]): boolean {
    if (!this.isValidFlag(flag)) {
      console.error("Invalid flag:", flag);
      return false;
    }
    return (this.flags & flag) === flag;
  }
}
