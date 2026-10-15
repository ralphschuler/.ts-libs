import assert from "node:assert/strict";
import { Network, Neuron } from "../src/index.js";
const network = new Network(
  1,
  [],
  1,
  (bias) => new Neuron(bias),
  () => 0.5,
);
const before = network.activate([1])[0];
network.train([1], [1]);
assert.ok(network.activate([1])[0] > before);
