import assert from "node:assert/strict";
import { it } from "node:test";
import { Manager, Worker } from "./index.js";
it("broadcasts to registered endpoints and preserves partial success", async () => {
  const manager = new Manager<number, number>();
  const worker = new Worker("a", (n: number) => n * 2);
  manager.registerNode(worker);
  manager.registerNode(
    new Worker("b", () => {
      throw new Error("unavailable");
    }),
  );
  assert.throws(() => manager.registerNode(worker), /Duplicate/);
  const results = await manager.broadcast(3);
  assert.deepEqual(results[0], { status: "fulfilled", value: 6 });
  assert.equal(results[1].status, "rejected");
  assert.equal(manager.unregisterNode("a"), true);
});
