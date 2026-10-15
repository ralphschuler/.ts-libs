import assert from "node:assert/strict";
import { TaskManager } from "../src/index.js";
const manager = new TaskManager(2);
assert.equal(await manager.addTask((value: number) => value * 2, 0, 21), 42);
manager.destroy();
