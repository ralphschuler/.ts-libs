import assert from "node:assert/strict";
import { it } from "node:test";
import { AIFunctionCaller, AIFunction } from "./index.js";
const definition: AIFunction<number> = {
  name: "add",
  description: "Add two integers",
  parameters: {
    type: "object",
    properties: {
      a: { type: "integer", description: "a" },
      b: { type: "integer", description: "b" },
    },
    required: ["a", "b"],
  },
  method: async (raw) => {
    const { a, b } = JSON.parse(raw);
    return a + b;
  },
};
it("executes a validated function request and returns the final answer without provider secrets", async () => {
  let calls = 0;
  const client = {
    chat: {
      completions: {
        create: async (request: any) => {
          assert.equal("method" in request.functions[0], false);
          if (calls++ === 0)
            return {
              choices: [
                {
                  message: {
                    role: "assistant",
                    content: null,
                    function_call: { name: "add", arguments: '{"a":2,"b":3}' },
                  },
                },
              ],
            };
          assert.equal(request.messages.at(-1).content, "5");
          return {
            choices: [{ message: { role: "assistant", content: "5" } }],
          };
        },
      },
    },
  } as any;
  assert.equal(
    await new AIFunctionCaller([definition], [], { client }).query("2+3"),
    "5",
  );
});
it("rejects unknown names, invalid arguments and endless tool requests", async () => {
  for (const [name, args, pattern] of [
    ["unknown", "{}", /Unknown function/],
    ["add", '{"a":"x","b":1}', /Invalid argument/],
    ["add", '{"a":1,"b":2}', /limit/],
  ] as const) {
    const client = {
      chat: {
        completions: {
          create: async () => ({
            choices: [
              {
                message: {
                  content: null,
                  function_call: { name, arguments: args },
                },
              },
            ],
          }),
        },
      },
    } as any;
    await assert.rejects(
      new AIFunctionCaller([definition], [], { client, maxSteps: 2 }).query(
        "test",
      ),
      pattern,
    );
  }
});
