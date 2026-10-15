export type DiffResult<T> = Record<string, [T | undefined, T | undefined]>;
export function arrayDifference<T>(
  left: readonly T[],
  right: readonly T[],
): T[] {
  const excluded = new Set(right);
  return left.filter((value) => !excluded.has(value));
}
export function objectDifference<T>(
  left: Record<string, T>,
  right: Record<string, T>,
): DiffResult<T> {
  const result: DiffResult<T> = Object.create(null);
  for (const key of new Set([...Object.keys(left), ...Object.keys(right)])) {
    const hasLeft = Object.hasOwn(left, key);
    const hasRight = Object.hasOwn(right, key);
    if (hasLeft !== hasRight || !Object.is(left[key], right[key]))
      result[key] = [
        hasLeft ? left[key] : undefined,
        hasRight ? right[key] : undefined,
      ];
  }
  return result;
}
