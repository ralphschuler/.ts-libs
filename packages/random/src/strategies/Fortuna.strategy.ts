import { randomBytes } from "node:crypto";
import { PseudoRandomNumberGenerator } from "../PseudoRandomNumberGenerator.js";
import { Seed } from "../Seed.js";
/**
 * Compatibility facade using the operating system CSPRNG.
 * This is not an implementation of the Fortuna algorithm and is not seed-reproducible.
 */
export class Fortuna extends PseudoRandomNumberGenerator {
  constructor(seed: Seed) {
    super(seed);
  }
  addEvent(_event: Buffer, _poolIndex = 0): void {
    throw new Error(
      "Entropy injection is unsupported: node:crypto manages operating-system entropy",
    );
  }
  nextFloat(): number {
    return randomBytes(4).readUInt32LE() / 4294967296;
  }
}
