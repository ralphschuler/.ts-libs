import assert from "node:assert/strict";
import { StatsTracker } from "../src/index.js";
let time = 0;
const tracker = new StatsTracker(() => time);
tracker.logEvent("enqueue", { data: "example" });
assert.equal(tracker.getCount("enqueue"), 1);
time = 60_000;
assert.equal(tracker.getCount("enqueue"), 0);
