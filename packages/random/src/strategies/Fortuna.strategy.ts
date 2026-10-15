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
    // A fixed exponent and 52 uniformly random mantissa bits represent [1, 2).
    // Subtracting one gives an exact uniform grid in [0, 1), without modulo
    // reduction, rounding, or an inclusive upper endpoint.
    const bits = randomBytes(8);
    bits[7] = 0x3f;
    bits[6] = (bits[6] & 0x0f) | 0xf0;
    return bits.readDoubleLE() - 1;
  }
}
