import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { WorkerPool } from "./WorkerPool.js";

describe("WorkerPool", async () => {
  const poolSize = 2;
  const testTasks = 100;
  const pool = new WorkerPool(poolSize);

  it("should create a worker pool of size " + poolSize, async () => {
    assert.strictEqual(pool.size, poolSize);
  });

  it(
    "should execute " + testTasks + " tasks using " + poolSize + " workers",
    async () => {
      const executionMethod = async () => {
        const delay = Math.floor(Math.random() * 10000);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return "Task executed";
      };

      const results: string[] = [];
      const numTasks = 5;
      const promises: Promise<void>[] = [];

      for (let i = 0; i < numTasks; i++) {
        const promise = pool.executeMethod(executionMethod).then((result) => {
          results.push(result);
        });
        promises.push(promise);
      }

      await Promise.all(promises);
      pool.destroy();

      assert.strictEqual(results.length, numTasks);
      results.forEach((result) => {
        assert.strictEqual(result, "Task executed");
      });
    },
  );
});
