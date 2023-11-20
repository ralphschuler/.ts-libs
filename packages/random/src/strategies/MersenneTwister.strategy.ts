import { PseudoRandomNumberGenerator } from "../PseudoRandomNumberGenerator.js";
import { Seed } from "../Seed.js";
import { Buffer } from "node:buffer";

export class MersenneTwister extends PseudoRandomNumberGenerator {
  private N: number = 624;
  private M: number = 397;
  private MATRIX_A: number = 0x9908b0df;
  private UPPER_MASK: number = 0x80000000;
  private LOWER_MASK: number = 0x7fffffff;
  private mt: Uint32Array = new Uint32Array(this.N); // Using Uint32Array
  private mti: number = this.N + 1;

  constructor(seed: Seed) {
    const seedBuffer = seed.length >= 4 ? seed : Buffer.alloc(4, seed);
    super(seedBuffer);

    this.init_genrand(this.seed);
  }

  private init_genrand(seedBuffer: Buffer): void {
    try {
      const s: number = seedBuffer.readUInt32LE(0) >>> 0;
      this.mt[0] = s;
      for (this.mti = 1; this.mti < this.N; this.mti++) {
        const s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
        this.mt[this.mti] =
          (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
            (s & 0x0000ffff) * 1812433253 +
            this.mti) >>>
          0;
      }
      this.updateSeed();
    } catch (error: any) {
      throw new Error(
        `[Mersenne Twister] Error initializing Mersenne Twister: ${error.message}`,
      );
    }
  }

  private updateSeed(): void {
    try {
      const buffer = Buffer.alloc(this.N * 4);
      for (let i = 0; i < this.N; i++) {
        buffer.writeUInt32LE(this.mt[i], i * 4);
      }
      this.seed = buffer;
    } catch (error: any) {
      throw new Error(
        `[Mersenne Twister] Error updating seed: ${error.message}`,
      );
    }
  }

  private genrand_int32(): number {
    try {
      let y: number;
      const mag01 = new Uint32Array([0x0, this.MATRIX_A]);

      if (this.mti >= this.N) {
        let kk: number;
        for (kk = 0; kk < this.N - this.M; kk++) {
          y =
            (this.mt[kk] & this.UPPER_MASK) |
            (this.mt[kk + 1] & this.LOWER_MASK);
          this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
        }
        for (; kk < this.N - 1; kk++) {
          y =
            (this.mt[kk] & this.UPPER_MASK) |
            (this.mt[kk + 1] & this.LOWER_MASK);
          this.mt[kk] =
            this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
        }
        y =
          (this.mt[this.N - 1] & this.UPPER_MASK) |
          (this.mt[0] & this.LOWER_MASK);
        this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

        this.mti = 0;
        this.updateSeed();
      }

      y = this.mt[this.mti++];
      y ^= y >>> 11;
      y ^= (y << 7) & 0x9d2c5680;
      y ^= (y << 15) & 0xefc60000;
      y ^= y >>> 18;

      this.updateSeed();

      return y >>> 0;
    } catch (error: any) {
      throw new Error(
        `[Mersenne Twister] Error generating random number: ${error.message}`,
      );
    }
  }

  public nextFloat(): number {
    try {
      return this.genrand_int32() * (1.0 / 4294967296.0);
    } catch (error: any) {
      throw new Error(
        `[Mersenne Twister] Error generating random number: ${error.message}`,
      );
    }
  }
}
