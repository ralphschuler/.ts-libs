import assert from "node:assert/strict";
import { it } from "node:test";
import { StatsTracker } from "./index.js";
it("expires events during idle reads at the exact window boundary", () => {
  let now = 0;
  const tracker = new StatsTracker(() => now, 30_000);
  tracker.logEvent("enqueue", { data: "a" });
  assert.equal(tracker.getCount("enqueue"), 1);
  assert.equal(tracker.getRatePerMinute("enqueue"), 2);
  now = 30_000;
  assert.equal(tracker.getCount("enqueue"), 0);
});
