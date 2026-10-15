import assert from "node:assert/strict";
import { it } from "node:test";
import { FruitSlotMachine, BaseSymbol } from "./index.js";
it("runs deterministically without console input and evaluates across reels", () => {
  const machine = new FruitSlotMachine(100, () => 0);
  machine.betAndSpin(1);
  assert.equal(machine.getCredit(), 104); // 3 rows + 2 diagonals, each pays 1.
  const a = new BaseSymbol("a", 2);
  const b = new BaseSymbol("b", 1);
  const c = new BaseSymbol("c", 1);
  assert.equal(
    machine.calculateWin(
      [
        [a, b, c],
        [a, c, b],
        [a, b, c],
      ],
      1,
    ),
    2,
  );
  assert.throws(() => machine.betAndSpin(NaN), RangeError);
  assert.throws(() => machine.betAndSpin(-1), RangeError);
  assert.throws(() => machine.betAndSpin(1000), RangeError);
});
