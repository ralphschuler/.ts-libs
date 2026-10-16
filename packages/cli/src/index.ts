export type ParameterType = "string" | "number" | "boolean";
export interface IArgument<T = unknown> {
  name: string;
  type: ParameterType;
  required?: boolean;
  description?: string;
  validator?: (value: T) => boolean;
}
export interface IFlag<T = unknown> extends IArgument<T> {
  alias?: string;
  default?: T;
}
export interface IContext {
  args: Record<string, any>;
  flags: Record<string, any>;
}
export interface ICommand {
  name: string;
  description?: string;
  help?: string;
  args?: IArgument[];
  flags?: IFlag[];
  run(context: IContext): void | Promise<void>;
}
export abstract class Command implements ICommand {
  abstract name: string;
  description = "";
  help = "";
  args?: IArgument[];
  flags?: IFlag[];
  abstract run(context: IContext): void | Promise<void>;
}
export type MiddlewareFunction = (
  context: IContext,
  next: () => Promise<void>,
) => void | Promise<void>;
export class CommandHandler {
  private readonly commands = new Map<string, ICommand>();
  private readonly middlewares: MiddlewareFunction[] = [];
  addCommand(command: ICommand): void {
    if (this.commands.has(command.name))
      throw new Error("Command already exists: " + command.name);
    this.commands.set(command.name, command);
  }
  removeCommand(command: ICommand): void {
    if (!this.commands.delete(command.name))
      throw new Error("Command not found: " + command.name);
  }
  use(middleware: MiddlewareFunction): void {
    this.middlewares.push(middleware);
  }
  async run(input: string | string[]): Promise<void> {
    // Pass argv as an array to preserve shell quoting. String input supports whitespace only.
    const [name, ...params] =
      typeof input === "string" ? input.trim().split(/\s+/) : input;
    const command = this.commands.get(name);
    if (!command) throw new Error("Command not found: " + name);
    const context: IContext = {
      args: Object.create(null),
      flags: Object.create(null),
    };
    const convert = (raw: string | boolean, definition: IArgument) => {
      const value =
        definition.type === "number"
          ? Number(raw)
          : definition.type === "boolean"
            ? raw === true || raw === "true"
            : String(raw);
      if (
        definition.type === "number" &&
        (!String(raw).trim() || !Number.isFinite(value))
      )
        throw new Error("Invalid number: " + definition.name);
      if (
        definition.type === "boolean" &&
        raw !== true &&
        raw !== "true" &&
        raw !== "false"
      )
        throw new Error("Invalid boolean: " + definition.name);
      if (definition.validator && !definition.validator(value))
        throw new Error("Validation failed: " + definition.name);
      return value;
    };
    let position = 0;
    for (const param of params) {
      if (param.startsWith("--")) {
        const separator = param.indexOf("=");
        const flagName = param.slice(2, separator < 0 ? undefined : separator);
        const flag = command.flags?.find(
          (entry) => entry.name === flagName || entry.alias === flagName,
        );
        if (!flag) throw new Error("Unknown flag: " + flagName);
        if (separator < 0 && flag.type !== "boolean")
          throw new Error("Flag requires =value: " + flagName);
        context.flags[flag.name] = convert(
          separator < 0 ? true : param.slice(separator + 1),
          flag,
        );
      } else {
        const arg = command.args?.[position++];
        if (!arg) throw new Error("Unexpected argument: " + param);
        context.args[arg.name] = convert(param, arg);
      }
    }
    for (const arg of command.args || [])
      if (arg.required && !(arg.name in context.args))
        throw new Error("Missing argument: " + arg.name);
    for (const flag of command.flags || []) {
      if (!(flag.name in context.flags) && flag.default !== undefined)
        context.flags[flag.name] = flag.default;
      if (flag.required && !(flag.name in context.flags))
        throw new Error("Missing flag: " + flag.name);
    }
    let last = -1;
    const dispatch = async (index: number): Promise<void> => {
      if (index <= last) throw new Error("next() called multiple times");
      last = index;
      if (index < this.middlewares.length)
        await this.middlewares[index](context, () => dispatch(index + 1));
      else await command.run(context);
    };
    await dispatch(0);
  }
}
export class Cli extends CommandHandler {}
