import assert from "node:assert/strict";
import { it } from "node:test";
import { register } from "prom-client";
import { PromCounter, PromHistogram, PromGauge } from "./index.js";
it("reuses counters and records async histogram observations", async () => {
  register.clear();
  const target = {
    count() {
      return 0;
    },
    async duration() {
      return 7;
    },
  };
  for (const [key, decorate] of [
    ["count", PromCounter({ name: "test_calls", help: "Calls" })],
    ["duration", PromHistogram({ name: "test_duration", help: "Duration" })],
  ] as const) {
    const descriptor = Object.getOwnPropertyDescriptor(target, key)!;
    decorate(target, key, descriptor);
    Object.defineProperty(target, key, descriptor);
  }
  assert.equal(target.count(), 0);
  assert.equal(target.count(), 0);
  assert.equal(await target.duration(), 7);
  const text = await register.metrics();
  assert.match(text, /test_calls 2/);
  assert.match(text, /test_duration_sum 7/);
});
it("keeps decorated property values separate between instances", () => {
  register.clear();
  class Example {
    declare value: number;
  }
  PromGauge({ name: "test_value", help: "Value" })(Example.prototype, "value");
  const a = new Example();
  const b = new Example();
  a.value = 3;
  b.value = 5;
  assert.equal(a.value, 3);
  assert.equal(b.value, 5);
});
