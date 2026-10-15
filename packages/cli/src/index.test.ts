import assert from "node:assert/strict";
import { it } from "node:test";
import { Cli } from "./index.js";
it("parses argv, converts values, validates input and awaits middleware", async () => {
  const cli = new Cli();
  const order: string[] = [];
  cli.addCommand({
    name: "greet",
    args: [{ name: "name", type: "string", required: true }],
    flags: [{ name: "times", type: "number", default: 1 }],
    run: ({ args, flags }) => {
      assert.equal(args.name, "Ada Lovelace");
      assert.equal(flags.times, 2);
      order.push("run");
    },
  });
  cli.use(async (_, next) => {
    order.push("before");
    await next();
    order.push("after");
  });
  await cli.run(["greet", "Ada Lovelace", "--times=2"]);
  assert.deepEqual(order, ["before", "run", "after"]);
  await assert.rejects(cli.run(["greet"]), /Missing argument/);
  await assert.rejects(
    cli.run(["greet", "Ada", "--times=no"]),
    /Invalid number/,
  );
  await assert.rejects(cli.run(["unknown"]), /Command not found/);
});
