import { PseudoRandomNumberGenerator } from "../PseudoRandomNumberGenerator.js";
import { Seed } from "../Seed.js";
/** Additive lagged Fibonacci sequence modulo 2^32, for simulation only. */
export class LaggedFibonacci extends PseudoRandomNumberGenerator {
  private readonly values: Uint32Array;
  private index = 0;
  constructor(
    seed: Seed,
    private readonly size = 100,
    private readonly j = 24,
    private readonly k = 55,
  ) {
    super(seed);
    if (
      !Number.isInteger(size) ||
      !Number.isInteger(j) ||
      !Number.isInteger(k) ||
      j < 1 ||
      k < 1 ||
      j >= size ||
      k >= size
    )
      throw new RangeError(
        "Lags must be positive integers smaller than the state size",
      );
    const generator = new PseudoRandomNumberGenerator(seed);
    this.values = Uint32Array.from({ length: size }, () =>
      Math.floor(generator.nextFloat() * 4294967296),
    );
  }
  nextFloat(): number {
    const value =
      (this.values[(this.index - this.j + this.size) % this.size] +
        this.values[(this.index - this.k + this.size) % this.size]) >>>
      0;
    this.values[this.index] = value;
    this.index = (this.index + 1) % this.size;
    return value / 4294967296;
  }
}
