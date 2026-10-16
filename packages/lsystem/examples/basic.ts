import assert from "node:assert/strict";
import { LSystem, SymbolType } from "../src/index.js";
const grammar = new LSystem("F", [
  {
    symbol: SymbolType.Forward,
    transform: [SymbolType.Forward, SymbolType.Forward],
    probability: 1,
  },
]);
assert.equal(grammar.generate(2), "FFFF");
