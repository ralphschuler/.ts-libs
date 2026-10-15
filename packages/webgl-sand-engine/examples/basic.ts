import assert from "node:assert/strict";
import { SandSimulation } from "../src/index.js";
const engine = new SandSimulation(1, 3, new Uint8Array([1, 0, 0]));
assert.deepEqual([...engine.step()], [0, 1, 0]);
