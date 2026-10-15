import assert from "node:assert/strict";
import { Manager, Worker } from "../src/index.js";
const manager = new Manager<number, number>();
manager.registerNode(new Worker("double", (value) => value * 2));
assert.deepEqual(await manager.broadcast(21), [
  { status: "fulfilled", value: 42 },
]);
