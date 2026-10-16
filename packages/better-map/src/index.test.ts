import assert from "node:assert/strict";
import { it } from "node:test";
import { BetterMap } from "./index.js";
it("distinguishes an explicit null or undefined default from an absent argument", () => {
  const map = new BetterMap<string, number | null | undefined>();
  const fail = () => {
    throw new Error("Updater should not run");
  };
  map.update("null", fail, null);
  map.update("undefined", fail, undefined);
  assert.equal(map.get("null"), null);
  assert.equal(map.has("undefined"), true);
  map.update("count", (previous) => (previous ?? 0) + 1);
  map.update("count", (previous) => Number(previous) + 1);
  assert.equal(map.get("count"), 2);
  const filtered = map.filter((value) => typeof value === "number");
  assert.equal(filtered.size, 1);
  assert.equal(map.size, 3);
});
