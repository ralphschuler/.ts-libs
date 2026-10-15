import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ProofOfWork } from "./index.js";

describe("ProofOfWork", () => {
  it("mines and validates a proof", async () => {
    const [nonce, hash] = await ProofOfWork.mine("ts-libs", 2);
    assert.equal(ProofOfWork.validate("ts-libs", nonce, 2, hash), true);
  });

  it("rejects malformed difficulty and invalid proofs", () => {
    assert.throws(
      () => ProofOfWork.validate("data", 1, -1, "hash"),
      RangeError,
    );
    assert.equal(ProofOfWork.validate("data", 1, 0, "wrong"), false);
  });
});
