import { PseudoRandomNumberGenerator } from "../PseudoRandomNumberGenerator";
import { Seed } from "../Seed";
import { Buffer } from 'node:buffer';

export class XORShift extends PseudoRandomNumberGenerator {
  private state: number;

  constructor(seed: Seed) {
    const seedBuffer = seed.length >= 4 ? seed : Buffer.alloc(4, seed);
    super(seedBuffer);

    this.state = seedBuffer.readUInt32LE(0);

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
      this.seed = newSeedBuffer;
  
      return (this.state >>> 0) / 0xFFFFFFFF;
    } catch (error: any) {
      throw new Error(`[XORShift] Error generating random number: ${error.message}`);
    }
  }

  public nextInt(min: number, max: number): number {
    try {
      return Math.floor(this.nextFloat() * (max - min + 1)) + min;
    } catch (error: any) {
      throw new Error(`[XORShift] Error generating random number: ${error.message}`);
    }
  }
}
