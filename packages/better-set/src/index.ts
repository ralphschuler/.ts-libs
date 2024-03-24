/**
 * A better Set class with more methods.
 * @template v The type of the values.
 */
export class BetterSet<v> extends Set<v> {
  /**
   * Filters the set by a predicate.
   * @param predicate - The predicate to filter by.
   * @returns A new set with the filtered values.
   */
  filter(predicate: (v: v) => boolean) {
    const newSet = new BetterSet<v>();
    const entries = Array.from(this.entries());
    for (const [value] of entries) {
      if (predicate(value)) newSet.add(value);
    }
    return newSet;
  }

  /**
   * Maps the set by a predicate.
   * @param predicate - The predicate to map by.
   * @returns A new set with the mapped values.
   * @template v2 The type of the mapped values.
   */
  merge(set: Set<v>) {
    const entries = Array.from(set.entries());
    for (const kv of entries) {
      this.add(kv[0]);
    }
  }

  /**
   * Maps the set by a predicate.
   * @param predicate - The predicate to map by.
   * @returns A new set with the mapped values.
   * @template v2 The type of the mapped values.
   */
  except(set: Set<v>) {
    const newSet = new Set<v>();
    const entries = Array.from(set.entries());
    for (const [value] of entries) {
      if (!this.has(value)) newSet.add(value);
    }
    return newSet;
  }

  /**
   * Maps the set by a predicate.
   * @param predicate - The predicate to map by.
   * @returns A new set with the mapped values.
   * @template v2 The type of the mapped values.
   */
  both(set: Set<v>) {
    const newSet = new Set<v>();
    const entries = Array.from(set.entries());
    for (const [value] of entries) {
      if (this.has(value)) newSet.add(value);
    }
    return newSet;
  }
}
