import assert from "node:assert/strict";
import { AIFunctionCaller } from "../src/index.js";
const client = {
  chat: {
    completions: {
      create: async () => ({
        choices: [{ message: { content: "Hello from the example provider" } }],
      }),
    },
  },
} as any;
assert.equal(
  await new AIFunctionCaller([], [], { client }).query("hello"),
  "Hello from the example provider",
);
