import assert from "node:assert/strict";
import { MDNS } from "../src/index.js";
// This model discovers publishers within this process.
const publisher = new MDNS();
const browser = new MDNS();
publisher.announce("_example._tcp.local", "SRV", 60, {
  priority: 0,
  weight: 0,
  port: 8080,
  target: "localhost",
});
assert.equal((await browser.query("_example._tcp.local", "SRV")).length, 1);
await publisher.destroy();
await browser.destroy();
