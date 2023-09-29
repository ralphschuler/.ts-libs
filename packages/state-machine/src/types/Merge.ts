/**
 * Merges a tuple of types into a single type by intersecting their properties.
 * Recursively combines properties from all types in the tuple.
 * @template T - Tuple of types to be merged.
 * @typedef {T extends [infer Head, ...infer Rest] ? Head & Merge<Rest> : {}} Merge
 */
export type Merge<T extends any[]> = T extends [infer Head, ...infer Rest] ? Head & Merge<Rest> : {};