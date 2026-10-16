import assert from "node:assert/strict";
import { StateMachine } from "../src/index.js";
const machine = new StateMachine<{ idle: {}; done: {} }, { finish: {} }, any>(
  "idle",
);
machine.addTransition("idle", "finish", "done");
await machine.transition("finish");
assert.equal(machine.getCurrentState(), "done");
