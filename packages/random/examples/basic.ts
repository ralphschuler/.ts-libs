import assert from "node:assert/strict";
import { Seed, XORShift } from "../src/index.js";
const a = new XORShift(new Seed(42));
const b = new XORShift(new Seed(42));
assert.deepEqual(
  Array.from({ length: 5 }, () => a.nextFloat()),
  Array.from({ length: 5 }, () => b.nextFloat()),
);
