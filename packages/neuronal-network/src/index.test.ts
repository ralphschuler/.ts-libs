import assert from "node:assert/strict";
import { it } from "node:test";
import { Network, Neuron } from "./index.js";
it("trains a numeric network and serializes it without graph recursion", () => {
  const network = new Network(
    1,
    [],
    1,
    (bias) => new Neuron(bias),
    () => 0.5,
  );
  const before = Math.abs(1 - network.activate([1])[0]);
  for (let i = 0; i < 100; i++) network.train([1], [1], 0.5);
  assert.ok(Math.abs(1 - network.activate([1])[0]) < before);
  assert.ok(JSON.stringify(network.toObject()).length > 0);
  assert.throws(() => network.activate([1, 2]), /shape/);
});
it("rejects cyclic connections", () => {
  const a = new Neuron(0);
  const b = new Neuron(0);
  a.connect(b, 1);
  assert.throws(() => b.connect(a, 1), /Cyclic/);
});
