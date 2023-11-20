import { Buffer } from 'node:buffer';
import { Seed } from './Seed';

export class PseudoRandomNumberGenerator {
  protected seed: Seed;

  constructor(seed: Seed) {
    this.seed = seed
  }

  public nextFloat(): number {
    try {
      return Math.random();
    } catch (error: any) {
      throw new Error(`[PseudoRandomNumberGenerator] Error generating random number: ${error.message}`);
    }
  }

  public nextInt(min: number, max: number): number {
    try {
      return Math.floor(this.nextFloat() * (max - min + 1)) + min;
    } catch (error: any) {
      throw new Error(`[PseudoRandomNumberGenerator] Error generating random number: ${error.message}`);
    }
  }
}
