
/**
 * A better Map class that has some more useful methods.
 *
 * @template k The type of the keys.
 * @template v The type of the values.
 */
export class BetterMap<k, v> extends Map<k, v> {
  
  /**
   * Updates a value in the map if it exists, otherwise sets it to the default value.
   * @param key - The key of the value to update.
   * @param updater - The function to update the value with.
   * @param notset - The default value to set if the key does not exist.
   */
  update(key: k, updater: (v: v, k: k) => v, notset?: v) {
    if (this.has(key)) this.set(key, updater(this.get(key)!, key));
    else this.set(key, notset ?? updater(this.get(key)!, key));
  }

  /**
   * Filters the map by a predicate.
   * @param predicate - The predicate to filter by.
   * @returns A new map with the filtered values.
   */
  filter(predicate: (v: v, k: k) => boolean) {
    const newMap = new BetterMap<k, v>();
    const entries = Array.from(this.entries());
    for (const [key, value] of entries) {
      if (predicate(value, key)) newMap.set(key, value);
    }
    return newMap;
  }

  /**
   * Maps the map by a predicate.
   * @param predicate - The predicate to map by.
   * @returns A new map with the mapped values.
   */
  merge(map: Map<k, v>, resolve: (k: k, a: v, b: v) => v = (k, a, b) => b) {
    const entries = Array.from(map.entries());
    for (const [key, value] of entries) {
      if (this.has(key)) this.set(key, resolve(key, this.get(key)!, value));
      else this.set(key, value);
    }
  }
}
