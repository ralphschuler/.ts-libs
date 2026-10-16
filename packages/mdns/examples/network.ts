import { NetworkMDNS } from "../src/index.js";
// Optional integration demo: run on a machine with multicast enabled.
// This script opens UDP sockets explicitly and closes them after the query window.
const discovery = new NetworkMDNS();
try {
  discovery.start();
  discovery.announce("_ts-libs._tcp.local", "SRV", 60, {
    priority: 0,
    weight: 0,
    port: 8080,
    target: "localhost",
  });
  console.log(await discovery.query("_ts-libs._tcp.local", "SRV"));
} finally {
  await discovery.destroy();
}
