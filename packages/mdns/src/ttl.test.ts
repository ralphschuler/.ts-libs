import assert from "node:assert/strict";
import { it } from "node:test";
import { MDNS } from "./MDNS.js";
it("expires records at TTL and returns independent record copies", async () => {
  let now = 0;
  const publisher = new MDNS(() => now);
  const browser = new MDNS(() => now);
  publisher.announce("_ttl._tcp.local", "A", 1, { address: "127.0.0.1" });
  const records = await browser.query("_ttl._tcp.local", "A");
  records[0].name = "mutated";
  assert.equal((await browser.query("_ttl._tcp.local", "A")).length, 1);
  now = 1000;
  assert.equal((await browser.query("_ttl._tcp.local", "A")).length, 0);
  await publisher.destroy();
});
