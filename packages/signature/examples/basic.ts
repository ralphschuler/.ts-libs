import assert from "node:assert/strict";
import { Signature } from "../src/index.js";
const signer = new Signature<{ message: string }>();
const signed = await signer.signData({ message: "hello" });
assert.equal(await signer.verifySignature(signed), true);
