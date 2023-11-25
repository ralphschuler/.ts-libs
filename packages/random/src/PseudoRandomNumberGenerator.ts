import { Seed } from "./Seed.js";

export class PseudoRandomNumberGenerator {
  protected seed: Seed;

  constructor(seed: Seed) {
    this.seed = seed;
  }

  public nextFloat(): number {
    try {
      return Math.random();
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
