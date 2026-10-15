import assert from "node:assert/strict";
import { it } from "node:test";
import {
  Seed,
  PseudoRandomNumberGenerator,
  PseudoRandomItemSelector,
  LinearCongruential,
  XORShift,
  LaggedFibonacci,
  MersenneTwister,
  WichmannHill,
  Fortuna,
} from "./index.js";
it("preserves odd-length hex seeds and reproduces each deterministic strategy", () => {
  assert.equal(new Seed(15).toString(), "0f");
  assert.equal(new Seed("abc").toString(), "0abc");
  for (const Generator of [
    PseudoRandomNumberGenerator,
    LinearCongruential,
    XORShift,
    LaggedFibonacci,
    MersenneTwister,
    WichmannHill,
  ]) {
    const a = new Generator(new Seed(123));
    const b = new Generator(new Seed(123));
    const sequence = Array.from({ length: 20 }, () => a.nextFloat());
    assert.deepEqual(
      sequence,
      Array.from({ length: 20 }, () => b.nextFloat()),
    );
    assert.ok(sequence.every((value) => value >= 0 && value < 1));
    assert.ok(new Set(sequence).size > 1);
  }
  const secure = new Fortuna(new Seed(0));
  for (let index = 0; index < 1000; index++) {
    const value = secure.nextFloat();
    assert.ok(Number.isFinite(value) && value >= 0 && value < 1);
  }
  assert.throws(() => secure.addEvent(Buffer.from("event")), /unsupported/);
});
it("normalizes arbitrary selection weights and never selects zero-weight items", () => {
  class Fixed extends PseudoRandomNumberGenerator {
    nextFloat() {
      return 0;
    }
  }
  const selector = new PseudoRandomItemSelector(
    [
      { value: "never", weightPercentage: 0 },
      { value: "always", weightPercentage: 2 },
    ],
    new Fixed(new Seed(0)),
  );
  assert.equal(selector.select(), "always");
});
