import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MDNS } from "./MDNS.js";

describe("MDNS", () => {
  it("discovers announced records and releases them on destroy", async () => {
    const announcer = new MDNS();
    const browser = new MDNS();
    announcer.announce("_ts-libs._tcp.local", "SRV", 60, {
      priority: 0,
      weight: 0,
      port: 8080,
      target: "localhost",
    });
    assert.equal((await browser.query("_ts-libs._tcp.local", "SRV")).length, 1);
    await announcer.destroy();
    assert.equal((await browser.query("_ts-libs._tcp.local", "SRV")).length, 0);
  });
});
