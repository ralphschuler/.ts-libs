import crypto, { BinaryLike } from "node:crypto";
import { Buffer } from "node:buffer";
import { PseudoRandomNumberGenerator } from "../PseudoRandomNumberGenerator.js";
import { Seed } from "../Seed.js";

export class Fortuna extends PseudoRandomNumberGenerator {
  private pools: Buffer[];
  private poolIndex: number = 0;
  private reseedCounter: number = 0;
  private readonly keySize: number = 32; // AES-256
  private cipherKey: BinaryLike;
  private autoPoolIndex: number = 0;

  constructor(seed: Seed) {
    super(seed);
    this.pools = Array(32).fill(Buffer.alloc(this.keySize));
    this.cipherKey = Buffer.alloc(this.keySize)
      .fill(0)
      .map((_: unknown, i: number) => this.seed[i % this.seed.length]);
  }

  // Function to add entropy (random events) to the pools
  public addEvent(event: Buffer, poolIndex: number = this.autoPoolIndex) {
    try {
      this.pools[poolIndex] = crypto
        .createHash("sha256")
        .update(Buffer.concat([this.pools[poolIndex], event]))
        .digest();
      this.autoPoolIndex = (this.autoPoolIndex + 1) % 32;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `[Fortuna] Error adding event to pool: ${error.message}`,
        );
      } else {
        throw error;
      }
    }
  }

  // Create a seeded hash using crypto
  private createSeededHash(data: Buffer): Buffer {
    try {
      const hash = crypto.createHmac("sha256", this.cipherKey);
      hash.update(data);
      return hash.digest();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `[Fortuna] Error creating seeded hash: ${error.message}`,
        );
      } else {
        throw error;
      }
    }
  }

  // Updating the pool with new entropy
  private updatePool() {
    try {
      const encrypted = this.createSeededHash(this.pools[this.poolIndex]);
      this.pools[this.poolIndex] = encrypted;
      this.poolIndex = (this.poolIndex + 1) % this.keySize;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `[Fortuna] Error updating pool with new entropy: ${error.message}`,
        );
      } else {
        throw error;
      }
    }
  }

  // Reseeding mechanism to periodically update the seed
  private reseed() {
    try {
      if (this.reseedCounter >= 10000) {
        this.cipherKey = this.pools.reduce(
          (acc, val) => Buffer.concat([acc, val]),
          Buffer.alloc(0),
        );
        this.reseedCounter = 0;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `[Fortuna] Error reseeding the generator: ${error.message}`,
        );
      } else {
        throw error;
      }
    }
  }

  // Overriding the nextFloat method
  public nextFloat(): number {
    try {
      this.updatePool();
      this.reseed();
      this.reseedCounter++;
      return super.nextFloat();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `[Fortuna] Error generating random number: ${error.message}`,
        );
      } else {
        throw error;
      }
    }
  }

  // Overriding the nextInt method
  public nextInt(min: number, max: number): number {
    try {
      this.updatePool();
      this.reseed();
      this.reseedCounter++;
      return super.nextInt(min, max);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `[Fortuna] Error generating random number: ${error.message}`,
        );
      } else {
        throw error;
      }
    }
  }
}
