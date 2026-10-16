import assert from "node:assert/strict";
import { FruitSlotMachine } from "../src/index.js";
const machine = new FruitSlotMachine(100, () => 0);
machine.betAndSpin(1);
assert.equal(machine.getCredit(), 104);
