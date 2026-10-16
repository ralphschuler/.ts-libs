import assert from "node:assert/strict";
import { arrayDifference, objectDifference } from "../src/index.js";
assert.deepEqual(arrayDifference([1, 2], [2, 3]), [1]);
assert.deepEqual(
  { ...objectDifference({ score: 1 }, { score: 2 }) },
  { score: [1, 2] },
);
