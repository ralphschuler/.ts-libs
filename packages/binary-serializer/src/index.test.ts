import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BinarySerializer } from "./index.js";

describe("BinarySerializer", () => {
  it("round-trips fixed-size primitive fields and arrays", () => {
    const schema = {
      age: "number" as const,
      isActive: "boolean" as const,
      name: { type: "string" as const, length: 10 },
      scores: {
        type: "array" as const,
        itemType: "number" as const,
        itemCount: 3,
      },
    };
    const input = {
      age: 30,
      isActive: true,
      name: "John",
      scores: [95, 88, 75],
    };
    const bytes = new BinarySerializer(schema)
      .serialize(input, schema)
      .getBuffer();
    const output = new BinarySerializer(schema)
      .setBuffer(bytes)
      .deserialize(schema);

    assert.deepEqual(output, input);
  });
});
