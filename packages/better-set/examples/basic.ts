import assert from "node:assert/strict";
import { BetterSet } from "../src/index.js";
const left = new BetterSet([1, 2]);
const right = new BetterSet([2, 3]);
assert.deepEqual([...left.both(right)], [2]);
assert.deepEqual([...left.except(right)], [3]); // argument minus receiver
