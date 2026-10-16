import assert from "node:assert/strict";
import { Cli } from "../src/index.js";
const cli = new Cli();
let greeting = "";
cli.addCommand({
  name: "hello",
  args: [{ name: "name", type: "string", required: true }],
  run: ({ args }) => {
    greeting = "Hello " + args.name;
  },
});
await cli.run(["hello", "Ada Lovelace"]);
assert.equal(greeting, "Hello Ada Lovelace");
