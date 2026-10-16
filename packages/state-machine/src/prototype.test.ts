import assert from "node:assert/strict";
import { it } from "node:test";
import { StateMachine } from "./StateMachine.js";

it("treats prototype property names as ordinary state and event keys", async () => {
  const before = Object.getOwnPropertyDescriptors(Object.prototype);
  const machine = new StateMachine<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>
  >("__proto__");
  machine.addTransition("__proto__", "__proto__", "constructor");
  assert.deepEqual(Object.getOwnPropertyDescriptors(Object.prototype), before);
  await machine.transition("__proto__");
  assert.equal(machine.getCurrentState(), "constructor");
  assert.equal(machine.isInEndState(), true);

  const idle = new StateMachine<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>
  >("idle", { idle: { on: {} } });
  await idle.transition("toString");
  assert.equal(idle.getCurrentState(), "idle");
  assert.deepEqual(Object.getOwnPropertyDescriptors(Object.prototype), before);
});
