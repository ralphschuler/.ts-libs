interface IParameter<T> {
  name: string;
  type: T;
  description?: string;
}

interface IFlag<T> extends IParameter<T> {
  alias?: string;
  default?: T;
}

interface IArgument<T> extends IParameter<T> {
  required?: boolean;
}

interface IContext {
  args: string[];
  flags: Record<string, any>;
}

interface ICommand {
  name: string;
  description?: string;
  arguments?: IArgument<any>[];
  flags?: IFlag<any>[];
  run: (context: IContext) => void;
}

interface ICommandHandler {
  commands: ICommand[];
}
