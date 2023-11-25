import { PseudoRandomNumberGenerator } from "../PseudoRandomNumberGenerator.js";
import { Seed } from "../Seed.js";
import { Buffer } from "node:buffer";

export class WichmannHill extends PseudoRandomNumberGenerator {
  private s1: number;
  private s2: number;
  private s3: number;

  constructor(seed: Seed) {
    const seedBuffer =
      seed.length >= 12
        ? seed
        : new Seed(Buffer.alloc(12, seed.toString("hex"), "hex"));
    super(seedBuffer);

    this.s1 = Math.max(1, seedBuffer.buffer.readUInt32LE(0) % 30269);
    this.s2 = Math.max(1, seedBuffer.buffer.readUInt32LE(4) % 30307);
    this.s3 = Math.max(1, seedBuffer.buffer.readUInt32LE(8) % 30323);
  }

  public nextFloat(): number {
    try {
      this.s1 = (171 * this.s1) % 30269;
      this.s2 = (172 * this.s2) % 30307;
      this.s3 = (170 * this.s3) % 30323;

      const r = (this.s1 / 30269 + this.s2 / 30307 + this.s3 / 30323) % 1;

      // Update the seed buffer
      this.updateSeed();

      return r;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `[WichmannHill] Error generating random number: ${error.message}`,
        );
      } else {
        throw error;
      }
    }
  }

  private updateSeed(): void {
    try {
      const newSeedBuffer = Buffer.alloc(12);
      newSeedBuffer.writeUInt32LE(this.s1, 0);
      newSeedBuffer.writeUInt32LE(this.s2, 4);
      newSeedBuffer.writeUInt32LE(this.s3, 8);
      this.seed = new Seed(newSeedBuffer);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`[WichmannHill] Error updating seed: ${error.message}`);
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
          `[WichmannHill] Error generating random number: ${error.message}`,
        );
      } else {
        throw error;
      }
    }
  }
}
