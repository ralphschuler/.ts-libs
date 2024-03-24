type DiffResult<T> = { [key: string]: [T | undefined, T | undefined] };

declare global {
  interface Array<T> {
    difference(otherArray: Array<T>): Array<T>;
  }

  interface ObjectConstructor {
    difference<T>(
      obj1: { [key: string]: T },
      obj2: { [key: string]: T },
    ): DiffResult<T>;
  }
}

// Implement the extension for Array
Array.prototype.difference = function <T>(this: T[], otherArray: T[]): T[] {
  return this.filter((x) => !otherArray.includes(x));
};

// Implement the extension for Object
Object.difference = function <T>(
  obj1: { [key: string]: T },
  obj2: { [key: string]: T },
): DiffResult<T> {
  const diff: DiffResult<T> = {};
  for (const key in obj1) {
    if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
      if (obj1[key] !== obj2[key]) {
        diff[key] = [obj1[key], obj2[key]];
      }
    } else if (obj1.hasOwnProperty(key)) {
      diff[key] = [obj1[key], undefined];
    }
  }
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key) && !obj1.hasOwnProperty(key)) {
      diff[key] = [undefined, obj2[key]];
    }
  }
  return diff;
};
