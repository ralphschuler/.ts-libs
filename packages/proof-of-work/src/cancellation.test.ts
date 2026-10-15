import assert from "node:assert/strict";
import { it } from "node:test";
import { ProofOfWork } from "./index.js";
it("lets a timer abort a hard search and rejects impossible target lengths", async () => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error("cancelled")), 10);
  try {
    await assert.rejects(
      ProofOfWork.mine("abort", 64, "0", controller.signal),
      /cancelled/,
    );
  } finally {
    clearTimeout(timer);
  }
  await assert.rejects(ProofOfWork.mine("invalid", 65), RangeError);
});
