import assert from "node:assert/strict";
import { it } from "node:test";
import { once } from "node:events";
import { P2P, Peer } from "./index.js";
it("transfers framed bytes over loopback and shuts down active connections", async () => {
  const node = new P2P(0);
  let peer: Peer | undefined;
  try {
    await node.start();
    const [info] = await node.discoverPeers();
    peer = new Peer(info);
    await peer.connect();
    const incoming = once(node, "data");
    peer.send(Buffer.from("hello"));
    const [message] = await incoming;
    assert.equal(message.toString(), "hello");
    await node.destroy();
  } finally {
    peer?.disconnect();
    await node.destroy();
  }
});
