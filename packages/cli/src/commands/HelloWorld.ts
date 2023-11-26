export class HelloWorldCommand extends Command {
  public static name = "hello-world";
  public static description = "A simple hello world command";

  public static arguments: IArgument<any>[] = [
    {
      name: "name",
      description: "Your name",
      type: "string",
      required: true,
    },
  ];

  public static flags: IFlag<any>[] = [
    {
      name: "times",
      description: "Number of times to say hello",
      type: "number",
      default: 1,
    },
  ];

  public async run(context: IContext) {
    const { args, flags } = context;

    for (let i = 0; i < flags.times; i++) {
      console.log(`Hello ${args.name}!`);
    }
  }
}
