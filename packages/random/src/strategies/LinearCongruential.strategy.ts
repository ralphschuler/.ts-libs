import { PseudoRandomNumberGenerator } from "../PseudoRandomNumberGenerator.js";
import { Buffer } from 'node:buffer';
import { Seed } from "../Seed.js";

export class LinearCongruential extends PseudoRandomNumberGenerator {

  constructor(seed: Seed) {
    super(seed);
  }

  public nextFloat(): number {
    try {
      const a = 1103515245n;
      const c = 12345n;
      const m = 2n ** 32n;

      const seedHex = this.seed.toString('hex');
      const seedBigInt = seedHex ? BigInt(`0x${seedHex}`) : 0n;  // Add this check
  
      const newSeedBigInt = (a * seedBigInt + c) % m;
      const newSeedHex = newSeedBigInt.toString(16);

      this.seed = Buffer.from(newSeedHex, 'hex');
  
      return Number(newSeedBigInt) / Number(m);
    } catch (error: any) {
      throw new Error(`[LinearCongruential] Error generating random number: ${error.message}`);
    }
  }

  public nextInt(min: number, max: number): number {
    try {
      return Math.floor(this.nextFloat() * (max - min + 1)) + min;
    } catch (error: any) {
      throw new Error(`[LinearCongruential] Error generating random number: ${error.message}`);
    }
  }
}
