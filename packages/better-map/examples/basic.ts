import assert from "node:assert/strict";
import { BetterMap } from "../src/index.js";
const counts = new BetterMap<string, number>();
counts.update("visits", (previous) => (previous ?? 0) + 1);
assert.equal(counts.get("visits"), 1);
