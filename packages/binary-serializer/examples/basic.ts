import assert from "node:assert/strict";
import { BinarySerializer } from "../src/index.js";
const schema = { count: "number" as const, ready: "boolean" as const };
const bytes = new BinarySerializer(schema)
  .serialize({ count: 42, ready: true }, schema)
  .getBuffer();
assert.deepEqual(
  new BinarySerializer(schema).setBuffer(bytes).deserialize(schema),
  { count: 42, ready: true },
);
