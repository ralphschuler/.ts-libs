import { PseudoRandomNumberGenerator } from "../PseudoRandomNumberGenerator.js";
import { Seed } from "../Seed.js";
import { Buffer } from "node:buffer";

export class XORShift extends PseudoRandomNumberGenerator {
  private state: number;

  constructor(seed: Seed) {
    const seedBuffer =
      seed.length >= 4
        ? seed
        : new Seed(Buffer.alloc(4, seed.toString("hex"), "hex"));
    super(seedBuffer);

    this.state = seedBuffer.buffer.readUInt32LE(0);

    // Ensure the state is not zero
    if (this.state === 0) {
      this.state = 0x88675123; // A default non-zero value
    }
  }

  public nextFloat(): number {
    try {
      this.state ^= (this.state << 13) >>> 0;
      this.state ^= (this.state >>> 17) >>> 0;
      this.state ^= (this.state << 5) >>> 0;

      this.state = this.state >>> 0; // Make sure it's treated as an unsigned 32-bit integer

      const newSeedBuffer = Buffer.alloc(4);
      newSeedBuffer.writeUInt32LE(this.state, 0);
      this.seed = new Seed(newSeedBuffer);

      return (this.state >>> 0) / 0xffffffff;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `[XORShift] Error generating random number: ${error.message}`,
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
          `[XORShift] Error generating random number: ${error.message}`,
        );
      } else {
        throw error;
      }
    }
  }
}
