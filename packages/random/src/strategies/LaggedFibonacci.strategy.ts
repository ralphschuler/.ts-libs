import { PseudoRandomNumberGenerator } from "../PseudoRandomNumberGenerator.js";
import { Seed } from "../Seed.js";
import { Buffer } from "node:buffer";

export class LaggedFibonacci extends PseudoRandomNumberGenerator {
  private size: number;
  private j: number;
  private k: number;
  private s: Buffer[];
  private index: number;

  constructor(seed: Seed, size: number = 100, j: number = 24, k: number = 55) {
    super(seed);
    this.size = size;
    this.j = j;
    this.k = k;
    this.index = 0;
    this.s = Array.from({ length: size }, (_, i) => {
      const seedHex = this.seed.toString("hex");
      const seedBigInt = seedHex ? BigInt(`0x${seedHex}`) : 0n;
      return Buffer.from((seedBigInt + BigInt(i + 1)).toString(16), "hex");
    });
    this.initializeSeedArray();
  }

  private initializeSeedArray(): void {
    try {
      for (let i = 0; i < this.size; i++) {
        this.s[i] = Buffer.from(
          (this.nextFloat() * 0xffffffff).toString(16),
          "hex",
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `[LaggedFibonacci] Error initializing seed array: ${error.message}`,
        );
      } else {
        throw error;
      }
    }
  }

  public nextFloat(): number {
    try {
      const m = 2n ** 32n;

      const sjHex =
        this.s[(this.index - this.j + this.size) % this.size].toString("hex");
      const skHex =
        this.s[(this.index - this.k + this.size) % this.size].toString("hex");

      // Ensure the hexadecimal representation is not empty
      const sj = sjHex ? BigInt(`0x${sjHex}`) : 0n;
      const sk = skHex ? BigInt(`0x${skHex}`) : 0n;

      const newSeedBigInt = (sj + sk) % m;

      this.s[this.index] = Buffer.from(newSeedBigInt.toString(16), "hex");
      this.index = (this.index + 1) % this.size;

      return Number(newSeedBigInt) / Number(m);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `[LaggedFibonacci] Error generating random number: ${error.message}`,
        );
      } else {
        throw error;
      }
    }
  }
}
