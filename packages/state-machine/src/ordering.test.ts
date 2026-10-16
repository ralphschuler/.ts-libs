import assert from "node:assert/strict";
import { it } from "node:test";
import { StateMachine } from "./StateMachine.js";
it("serializes overlapping events and orders exit, action and target entry", async () => {
  const log: string[] = [];
  const machine = new StateMachine<any, any, any>("a", {
    a: {
      onExit: () => {
        log.push("exit a");
      },
      on: {
        next: {
          target: "b",
          guard: async () => true,
          action: async () => {
            await Promise.resolve();
            log.push("action");
          },
        },
      },
    },
    b: {
      onEntry: () => {
        log.push("entry b");
      },
      on: { next: { target: "c" } },
    },
    c: { on: {} },
  });
  let notifications = 0;
  const unsubscribe = machine.subscribe(() => {
    notifications++;
  });
  await Promise.all([machine.transition("next"), machine.transition("next")]);
  assert.equal(machine.getCurrentState(), "c");
  assert.deepEqual(log, ["exit a", "action", "entry b"]);
  assert.equal(notifications, 2);
  unsubscribe();
  assert.equal(machine.isInEndState(), true);
});
