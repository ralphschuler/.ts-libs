import { ClassOrInstance } from "./types";
import { PseudoRandomNumberGenerator } from "./PseudoRandomNumberGenerator";
import { Seed } from "./Seed";
import { Buffer } from 'node:buffer';

export type ItemSymbol = symbol | string | number;

export type Item<T extends ItemSymbol> = {
  value: T;
  weightPercentage: number;
};

export class PseudoRandomItemSelector<T extends ItemSymbol> {
  private items: Item<T>[] = [];
  private rng: PseudoRandomNumberGenerator;
  private mostLikelyItem: T;

  constructor(items: Item<T>[]);
  constructor(items: Item<T>[], seed: Seed);
  constructor(items: Item<T>[], rng: ClassOrInstance<PseudoRandomNumberGenerator>);
  constructor(items: Item<T>[], rng?: ClassOrInstance<PseudoRandomNumberGenerator>, seed?: Seed);
  constructor(items: Item<T>[], rngOrSeed?: ClassOrInstance<PseudoRandomNumberGenerator> | Seed, seed?: Seed) {
    this.items = items;

    if (rngOrSeed instanceof PseudoRandomNumberGenerator) {
      this.rng = rngOrSeed;
    } else if (typeof rngOrSeed === "function") {
      this.rng = new rngOrSeed(
        seed || new Seed(Buffer.alloc(32).fill(0).map((_: any, i: number) => i))
      );
    } else if (rngOrSeed) {
      this.rng = new PseudoRandomNumberGenerator(rngOrSeed);
    } else {
      throw new Error("No RNG or seed provided");
    }

    // Normalize the weights if total weight exceeds 100%
    const totalWeight = this.items.reduce(
      (sum, item) => sum + item.weightPercentage,
      0
    );
    const normalizationFactor = totalWeight > 100 ? 100 / totalWeight : 1;
    const normalizedItems = this.items.map((item) => ({
      ...item,
      weightPercentage: item.weightPercentage * normalizationFactor,
    }));

    // Precompute the most likely item
    this.mostLikelyItem = normalizedItems.reduce((prev, current) => {
      return prev.weightPercentage > current.weightPercentage ? prev : current;
    }).value;
  }

  public select(): T {
    const totalWeight = this.items.reduce(
      (sum, item) => sum + item.weightPercentage,
      0
    );

    // Normalize the weights if total weight exceeds 100%
    const normalizationFactor = totalWeight > 100 ? 100 / totalWeight : 1;
    const normalizedItems = this.items.map((item) => ({
      ...item,
      weightPercentage: item.weightPercentage * normalizationFactor,
    }));

    let random = this.rng.nextFloat() * 100; // As the normalized weights sum up to 100
    for (let i = 0; i < normalizedItems.length; i++) {
      random -= normalizedItems[i].weightPercentage;
      if (random <= 0) {
        return normalizedItems[i].value;
      }
    }

    // As a fallback, return the most likely item
    return this.mostLikelyItem;
  }
}
