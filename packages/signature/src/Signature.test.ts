import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Signature } from "./Signature.js";

describe("Signature", () => {
  it("signs and verifies a serializable payload", async () => {
    const signer = new Signature<{ message: string }>();
    const signed = await signer.signData({ message: "ts-libs" });
    assert.equal(await signer.verifySignature(signed), true);
    signed.payload.message = "changed";
    assert.equal(await signer.verifySignature(signed), false);
  });
});
