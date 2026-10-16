import assert from "node:assert/strict";
import { it } from "node:test";
import { SandSimulation, NeighborProvider } from "./index.js";
it("moves sand at most one row per step and conserves particles", () => {
  const simulation = new SandSimulation(
    3,
    3,
    new Uint8Array([0, 1, 0, 0, 0, 0, 0, 0, 0]),
  );
  const next = simulation.step();
  assert.equal(next[4], 1);
  assert.equal(
    next.reduce((a, b) => a + b, 0),
    1,
  );
  next[4] = 0;
  assert.equal(simulation.snapshot()[4], 1);
  simulation.step();
  assert.equal(simulation.snapshot()[7], 1);
  simulation.step();
  assert.equal(simulation.snapshot()[7], 1);
  assert.deepEqual(
    new NeighborProvider([
      { position: [0, 0] as [number, number] },
      { position: [3, 4] as [number, number] },
    ]).getNeighbors([0, 0], 1),
    [{ position: [0, 0] }],
  );
});
