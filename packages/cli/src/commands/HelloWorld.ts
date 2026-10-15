import { Command, IContext } from "../index.js";
export class HelloWorldCommand extends Command {
  name = "hello-world";
  description = "A simple hello world command";
  args = [{ name: "name", type: "string" as const, required: true }];
  flags = [
    {
      name: "times",
      type: "number" as const,
      default: 1,
      validator: (value: unknown) =>
        Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 100,
    },
  ];
  run(context: IContext): void {
    for (let i = 0; i < context.flags.times; i++)
      console.log("Hello " + context.args.name + "!");
  }
}
