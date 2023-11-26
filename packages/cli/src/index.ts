import { noThrow, isError } from "@ralphschuler/ts-error";

interface IParameter<T> {
  name: string;
  description?: string;
  help?: string;
  type: T; // Changed to directly use the type
  value: T;
  validator?: (value: T) => boolean;
}

class MissingArgumentError extends Error {
  constructor(argumentName: string) {
    super(`Missing argument: ${argumentName}`);
  }
}

class MissingFlagError extends Error {
  constructor(flagName: string) {
    super(`Missing flag: ${flagName}`);
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class ExecutionError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class CommandNotFoundError extends Error {
  constructor(commandName: string) {
    super(`Command not found: ${commandName}`);
  }
}

class CommandAlreadyExistsError extends Error {
  constructor(commandName: string) {
    super(`Command already exists: ${commandName}`);
  }
}

interface IFlag<T extends string | number | boolean> extends IParameter<T> {
  alias?: string;
  default?: T;
}

interface IArgument<T extends string | number | boolean> extends IParameter<T> {
  required: boolean;
}

interface ICollection<T> {
  [key: string]: T;
  get: (name: string) => T | undefined; // Corrected return type
}

interface IFlagCollection extends ICollection<IFlag<any>> {}
interface IArgumentCollection extends ICollection<IArgument<any>> {}

interface IContext {
  args: IArgumentCollection;
  flags: IFlagCollection;
}

type CommandFunction = (context: IContext) => Promise<void> | void;
type MiddlewareFunction = (context: IContext, next: CommandFunction) => void;

abstract class Command<T extends IArgument<any>, U extends IFlag<any>> {
  abstract name: string;
  abstract description: string;
  abstract help: string;
  abstract args?: T[];
  abstract flags?: U[];
  abstract run: CommandFunction;
}

interface ICommandHandler {
  addCommand(command: ICommand): void;
  removeCommand(command: ICommand): void;
  run(input: string): Promise<void>;
}

class CommandHandler implements ICommandHandler {
  commands: ICommand[] = [];
  middlewares: MiddlewareFunction[] = [];

  addCommand(command: ICommand): void {
    if (this.commands.find((cmd) => cmd.name === command.name)) {
      throw new CommandAlreadyExistsError(command.name);
    }
    this.commands.push(command);
  }

  removeCommand(command: ICommand): void {
    if (!this.commands.find((cmd) => cmd.name === command.name)) {
      throw new CommandNotFoundError(command.name);
    }
    this.commands = this.commands.filter((cmd) => cmd.name !== command.name);
  }

  use(middleware: MiddlewareFunction): void {
    this.middlewares.push(middleware);
  }

  async run(input: string): Promise<void> {
    const [commandName, ...params] = input.split(/\s+/);
    const command = this.commands.find((cmd) => cmd.name === commandName);

    if (!command) {
      throw new CommandNotFoundError(commandName);
    }

    const context: IContext = {
      args: {},
      flags: {},
    };

    this.parseArgumentsAndFlags(params, command, context);

    const runWithMiddlewares = async () => {
      let index = -1;

      const runner = async (i: number): Promise<void> => {
        if (i <= index) {
          throw new Error("next() called multiple times");
        }

        index = i;
        const middleware = this.middlewares[i];
        if (middleware) {
          await middleware(context, () => runner(i + 1));
        } else {
          await command.run(context);
        }
      };

      await runner(0);
    };

    await runWithMiddlewares();
  }

  private parseArgumentsAndFlags(
    params: string[],
    command: ICommand,
    context: IContext,
  ): void {
    let currentArgIndex = 0;

    for (const param of params) {
      if (param.startsWith("--")) {
        const [flagName, flagValue] = param.substring(2).split('=');
        const flag = command.flags?.find(
          (f) => f.name === flagName || f.alias === flagName,
        );
        if (!flag) {
          throw new MissingFlagError(flagName);
        }
        context.flags[flag.name] = flagValue ?? true; // Support for value flags
      } else {
        if (command.args && command.args.length > currentArgIndex) {
          const arg = command.args[currentArgIndex];
          context.args[arg.name] = param;
          currentArgIndex++;
        }
      }
    }

    command.args?.forEach((arg) => {
      if (arg.required && context.args[arg.name] === undefined) {
        throw new MissingArgumentError(arg.name);
      }
    });

    command.flags?.forEach((flag) => {
      if (
        context.flags[flag.name] === undefined &&
        flag.default !== undefined
      ) {
        context.flags[flag.name] = flag.default;
      }
    });
  }
}
