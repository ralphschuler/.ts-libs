import assert from "node:assert/strict";
import { WorkerPool } from "../src/index.js";
const pool = new WorkerPool(2);
try {
  assert.equal(
    await pool.executeMethod((value: number) => value * value, [7]),
    49,
  );
} finally {
  await pool.destroy();
}
