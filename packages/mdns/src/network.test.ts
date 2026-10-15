import assert from "node:assert/strict";
import { it } from "node:test";
import { EventEmitter } from "node:events";
import { NetworkMDNS, MulticastTransport } from "./index.js";
it("opens no transport on import or construction and collects multiple delayed answers", async () => {
  const transport = new EventEmitter() as EventEmitter & MulticastTransport;
  let opens = 0;
  let destroyed = false;
  const replies: any[] = [];
  transport.respond = (packet) => {
    replies.push(packet);
  };
  transport.query = () => {
    transport.emit("response", {
      answers: [
        { name: "service.local", type: "A", ttl: 10, data: "127.0.0.1" },
      ],
    });
    queueMicrotask(() =>
      transport.emit("response", {
        answers: [
          { name: "service.local", type: "A", ttl: 10, data: "127.0.0.2" },
          { name: "service.local", type: "A", ttl: 10, data: "127.0.0.1" },
        ],
      }),
    );
  };
  transport.destroy = (callback) => {
    destroyed = true;
    callback();
  };
  const mdns = new NetworkMDNS(() => {
    opens++;
    return transport;
  }, 20);
  assert.equal(opens, 0);
  await assert.rejects(mdns.query("service.local", "A"), /start/);
  mdns.start();
  mdns.announce("service.local", "A", 10, { address: "127.0.0.3" });
  transport.emit("query", {
    questions: [{ name: "service.local", type: "ANY" }],
  });
  assert.equal(replies.at(-1).answers[0].data, "127.0.0.3");
  assert.equal((await mdns.query("service.local", "A")).length, 2);
  await mdns.destroy();
  assert.equal(destroyed, true);
  assert.equal(replies.at(-1).answers[0].ttl, 0);
});
