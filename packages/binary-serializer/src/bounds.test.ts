import assert from "node:assert/strict";
import { it } from "node:test";
import { BinarySerializer, Serializable, AsNumber } from "./index.js";
it("enforces UTF-8 widths, exact arrays, nested layouts and truncated input", () => {
  class Child {}
  AsNumber(Child.prototype, "value");
  Serializable(Child);
  const schema = {
    child: { type: "Serialized" as const, class: Child },
    name: { type: "string" as const, length: 2 },
    values: {
      type: "array" as const,
      itemType: "number" as const,
      itemCount: 1,
    },
  };
  const serializer = new BinarySerializer(schema);
  const input = { child: { value: 42 }, name: "é", values: [7] };
  const bytes = serializer.serialize(input, schema).getBuffer();
  assert.equal(bytes.length, 10);
  assert.equal(bytes.readUInt32LE(), 42);
  const reordered = {
    values: schema.values,
    name: schema.name,
    child: schema.child,
  };
  assert.deepEqual(
    new BinarySerializer(reordered).serialize(input, reordered).getBuffer(),
    bytes,
  );
  assert.deepEqual(
    new BinarySerializer(schema).setBuffer(bytes).deserialize(schema),
    input,
  );
  assert.throws(
    () => serializer.serialize({ ...input, name: "€" }, schema),
    /UTF-8/,
  );
  assert.throws(
    () => serializer.serialize({ ...input, values: [] }, schema),
    /array length/,
  );
  assert.throws(
    () =>
      new BinarySerializer(schema)
        .setBuffer(bytes.subarray(0, 9))
        .deserialize(schema),
    /Truncated/,
  );
});
