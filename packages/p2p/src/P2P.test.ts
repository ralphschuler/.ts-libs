import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { P2P } from "./P2P.js";

describe("P2P", () => {
  it("announces the assigned TCP port and removes it when stopped", async () => {
    const node = new P2P(0);
    let listeningPort = 0;
    node.on("listening", (port: number) => {
      listeningPort = port;
    });

    await node.start();
    assert.ok(listeningPort > 0);
    assert.deepEqual(await node.discoverPeers(), [
      {
        id: `localhost:${listeningPort}`,
        hostname: "localhost",
        port: listeningPort,
        publicKey: "",
        annotations: {},
      },
    ]);

    await node.destroy();
    assert.deepEqual(await node.discoverPeers(), []);
  });
});
