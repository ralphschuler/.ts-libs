import crypto from "node:crypto";
import { Buffer } from 'node:buffer';
import { PseudoRandomNumberGenerator } from "../PseudoRandomNumberGenerator";
import { Seed } from "../Seed";

export class Fortuna extends PseudoRandomNumberGenerator {
  private pools: Buffer[];
  private poolIndex: number = 0;
  private reseedCounter: number = 0;
  private readonly keySize: number = 32; // AES-256
  private cipherKey: Buffer;
  private autoPoolIndex: number = 0;

  constructor(seed: Seed) {
    super(seed);
    this.pools = Array(32).fill(Buffer.alloc(this.keySize));
    this.cipherKey = Buffer.alloc(this.keySize).fill(0).map((_: any, i: number) => this.seed[i % this.seed.length]);
  }

  // Function to add entropy (random events) to the pools
  public addEvent(event: Buffer, poolIndex: number = this.autoPoolIndex) {
    try {
      this.pools[poolIndex] = crypto.createHash('sha256').update(Buffer.concat([this.pools[poolIndex], event])).digest();
      this.autoPoolIndex = (this.autoPoolIndex + 1) % 32;
    } catch (error: any) {
      throw new Error(`[Fortuna] Error adding event to pool: ${error.message}`);
    }
  }

  // Create a seeded hash using crypto
  private createSeededHash(data: Buffer): Buffer {
    try {
      const hash = crypto.createHmac('sha256', this.cipherKey);
      hash.update(data);
      return hash.digest();
    } catch (error: any) {
      throw new Error(`[Fortuna] Error creating seeded hash: ${error.message}`);
    }
  }

  // Updating the pool with new entropy
  private updatePool() {
    try {
      const encrypted = this.createSeededHash(this.pools[this.poolIndex]);
      this.pools[this.poolIndex] = encrypted;
      this.poolIndex = (this.poolIndex + 1) % this.keySize;
    } catch (error: any) {
      throw new Error(`[Fortuna] Error updating pool: ${error.message}`);
    }
  }

  // Reseeding mechanism to periodically update the seed
  private reseed() {
    try {
      if (this.reseedCounter >= 10000) {
        this.cipherKey = this.pools.reduce((acc, val) => Buffer.concat([acc, val]), Buffer.alloc(0));
        this.reseedCounter = 0;
      }
    } catch (error: any) {
      throw new Error(`[Fortuna] Error reseeding: ${error.message}`);
    }
  }

  // Overriding the nextFloat method
  public nextFloat(): number {
    try {
      this.updatePool();
      this.reseed();
      this.reseedCounter++;
      return super.nextFloat();
    } catch (error: any) {
      throw new Error(`[Fortuna] Error generating random number: ${error.message}`);
    }
  }

  // Overriding the nextInt method
  public nextInt(min: number, max: number): number {
    try {
      this.updatePool();
      this.reseed();
      this.reseedCounter++;
      return super.nextInt(min, max);
    } catch (error: any) {
      throw new Error(`[Fortuna] Error generating random number: ${error.message}`);
    }
  }
}
