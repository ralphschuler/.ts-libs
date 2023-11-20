import "reflect-metadata";
import { describe, it } from "node:test";
import { strictEqual } from "node:assert/strict";
import {
  Serializable,
  AsNumber,
  AsBoolean,
  AsString,
  AsArray,
} from "./index.js";

describe("Serialization Tests", () => {
  @Serializable
  class TestClass {
    @AsNumber
    age: number;

    @AsBoolean
    isActive: boolean;

    @AsString(10)
    name: string;

    @AsArray(Number, 3)
    scores: number[];
  }

  it("should serialize and deserialize correctly", () => {
    const instance = new TestClass();
    instance.age = 30;
    instance.isActive = true;
    instance.name = "John";
    instance.scores = [95, 88, 75];

    // @ts-expect-error
    const serializedData = instance.serialize();
    const deserializedInstance = new TestClass();
    // @ts-expect-error
    deserializedInstance.deserialize(serializedData);

    strictEqual(deserializedInstance.age, instance.age);
    strictEqual(deserializedInstance.isActive, instance.isActive);
    strictEqual(deserializedInstance.name, instance.name);
    strictEqual(deserializedInstance.scores, instance.scores);
  });
});

// Add more test cases and describe blocks as needed
