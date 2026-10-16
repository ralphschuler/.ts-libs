import assert from "node:assert/strict";
import { it } from "node:test";
import { LSystem, SymbolType } from "./index.js";
it("rewrites symbol sequences without commas and accepts deterministic randomness", () => {
  const engine = new LSystem(
    "F",
    [
      {
        symbol: SymbolType.Forward,
        transform: [SymbolType.Forward, SymbolType.Forward],
        probability: 3,
      },
    ],
    () => 0.5,
  );
  assert.equal(engine.generate(3), "FFFFFFFF");
  assert.throws(() => engine.generate(-1), RangeError);
});
