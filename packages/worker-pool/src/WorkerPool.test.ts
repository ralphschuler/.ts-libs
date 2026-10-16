import { it } from "node:test";
import assert from "node:assert/strict";
import { WorkerPool } from "./WorkerPool.js";

it("drains queued tasks through exactly the configured workers, preserving falsy results", async () => {
  const pool = new WorkerPool(2);
  try {
    assert.equal(pool.size, 2);
    const values = [0, false, "", undefined, 3];
    const results = await Promise.all(
      values.map((value) =>
        pool.executeMethod((input: unknown) => input, [value]),
      ),
    );
    assert.deepEqual(results, values);
    await assert.rejects(
      pool.executeMethod(() => {
        throw new Error("expected");
      }),
      /expected/,
    );
    assert.equal(await pool.executeMethod(() => 7), 7);
  } finally {
    await pool.destroy();
  }
});
it("rejects active and waiting tasks on shutdown and applies queue capacity", async () => {
  const pool = new WorkerPool(1, { maxQueueSize: 1 });
  const active = pool.executeMethod(() => new Promise(() => {}));
  const waiting = pool.executeMethod(() => 1);
  const activeFailure = assert.rejects(active, /stopped/);
  const waitingFailure = assert.rejects(waiting, /stopped/);
  await assert.rejects(
    pool.executeMethod(() => 2),
    /full/,
  );
  await pool.destroy();
  await Promise.all([activeFailure, waitingFailure]);
  await assert.rejects(
    pool.executeMethod(() => 3),
    /stopped/,
  );
});
it("replaces a timed-out worker and runs subsequent work", async () => {
  const pool = new WorkerPool(1, { taskTimeoutMs: 200 });
  try {
    await assert.rejects(
      pool.executeMethod(() => new Promise(() => {})),
      /timed out/,
    );
    assert.equal(await pool.executeMethod(() => 42), 42);
  } finally {
    await pool.destroy();
  }
});
