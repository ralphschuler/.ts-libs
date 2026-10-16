import assert from "node:assert/strict";
import { it } from "node:test";
import { KeyPairManager } from "./KeyPairManager.js";
import { KeyPairEncryption } from "./KeyPairEncryption.js";
import { Signature } from "./Signature.js";
it("round-trips encrypted keys and rejects password or tag tampering", async () => {
  const manager = new KeyPairManager();
  await manager.createNewKeyPair("a");
  const exported = JSON.parse(
    await manager.getPersistableKeyPair("a", "passphrase"),
  );
  const restored = await KeyPairEncryption.decrypt(exported, "passphrase");
  assert.equal(restored.privateKey.type, "private");
  await assert.rejects(KeyPairEncryption.decrypt(exported, "wrong"));
  exported.privateKey.tag = Buffer.alloc(16).toString("base64");
  await assert.rejects(KeyPairEncryption.decrypt(exported, "passphrase"));
});
it("returns false for an unknown signing key", async () => {
  const signer = new Signature<{ value: number }>();
  const envelope = await signer.signData({ value: 1 });
  envelope.header.keyId = "missing";
  assert.equal(await signer.verifySignature(envelope), false);
});
