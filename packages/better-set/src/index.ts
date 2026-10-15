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
   * Adds all values from another set to this set.
   * @param set - The values to add.
   */
  merge(set: Set<v>) {
    const entries = Array.from(set.entries());
    for (const kv of entries) {
      this.add(kv[0]);
    }
  }

  /**
   * Finds values in the argument that are absent from this set.
   * @param set - The set to subtract this set from.
   * @returns A new set containing argument-only values.
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
   * Finds values shared by both sets.
   * @param set - The set to intersect with this set.
   * @returns A new set containing the shared values.
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
