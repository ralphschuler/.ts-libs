import assert from "node:assert/strict";
import { ProofOfWork } from "../src/index.js";
const [nonce, hash] = await ProofOfWork.mine("example", 1);
assert.equal(ProofOfWork.validate("example", nonce, 1, hash), true);
