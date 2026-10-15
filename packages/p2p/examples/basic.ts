import assert from "node:assert/strict";
import { P2P } from "../src/index.js";
const node = new P2P(0);
try {
  await node.start();
  const peers = await node.discoverPeers();
  assert.ok(peers[0].port > 0);
} finally {
  await node.destroy();
}
