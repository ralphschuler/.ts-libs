import { Seed } from "./Seed.js";

export class PseudoRandomNumberGenerator {
  protected seed: Seed;
  private generatorState = 2166136261;

  constructor(seed: Seed) {
    this.seed = seed;
    for (const byte of seed.buffer)
      this.generatorState =
        Math.imul(this.generatorState ^ byte, 16777619) >>> 0;
  }

  public nextFloat(): number {
    try {
      this.generatorState =
        (Math.imul(this.generatorState, 1664525) + 1013904223) >>> 0;
      return this.generatorState / 4294967296;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `[PseudoRandomNumberGenerator] Error generating random number: ${error.message}`,
        );
      } else {
        throw error;
      }
    }
  }

  public nextInt(min: number, max: number): number {
    if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max)
      throw new RangeError("Invalid integer range");
    try {
      return Math.floor(this.nextFloat() * (max - min + 1)) + min;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `[PseudoRandomNumberGenerator] Error generating random number: ${error.message}`,
        );
      } else {
        throw error;
      }
    }
  }
}
