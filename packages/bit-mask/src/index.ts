export type NumericEnum = Record<string, string | number>;
/** Supports positive, single-bit flags within JavaScript's signed 32-bit bitwise range. */
export class BitwiseFeatureFlags<T extends NumericEnum> {
  private flags = 0;
  private readonly validFlags: Set<number>;
  constructor(validFlags: T) {
    this.validFlags = new Set(
      Object.values(validFlags).filter(
        (value): value is number =>
          typeof value === "number" &&
          Number.isInteger(value) &&
          value > 0 &&
          value <= 0x40000000 &&
          (value & (value - 1)) === 0,
      ),
    );
  }
  private validate(flag: unknown): asserts flag is number {
    if (typeof flag !== "number" || !this.validFlags.has(flag))
      throw new RangeError("Expected a declared single-bit flag");
  }
  enableFlag(flag: T[keyof T]): void {
    this.validate(flag);
    this.flags |= flag;
  }
  disableFlag(flag: T[keyof T]): void {
    this.validate(flag);
    this.flags &= ~flag;
  }
  isFlagEnabled(flag: T[keyof T]): boolean {
    this.validate(flag);
    return (this.flags & flag) === flag;
  }
}
