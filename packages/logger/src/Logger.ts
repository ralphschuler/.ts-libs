import { ProgressAnimation } from "./animations/ProgressAnimation";
import { c } from "./Color";
import { LogLevel } from "./enums/LogLevel";
import readline from "node:readline";
import { IMessage } from "./interfaces/IMessage";

export class Logger {
  private outputFormat: string;
  private breadcrumbs: string[];
  private buffer: string[]
  private level: LogLevel;
  private stdout: NodeJS.WriteStream;

  private static instance: Logger;
  public static getInstance(
    outputFormat: string = "{timestamp} - {level} - {message}",
    level?: LogLevel,
    stdout = process.stdout
  ): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(outputFormat, level, stdout);
    }

    return Logger.instance;
  }

  /**
   * Constructs a new Logger instance.
   * @param outputFormat - The format for log messages.
   * @param level Optional - The log level to show
   */
  private constructor(
    outputFormat: string = "{timestamp} - {level} - {message}",
    level?: LogLevel,
    stdout = process.stdout
  ) {
    this.outputFormat = outputFormat;
    this.breadcrumbs = [];
    this.buffer = [];
    this.stdout = stdout;
    this.level =
      level || parseInt(process.env.LOG_LEVEL)
        ? (parseInt(process.env.LOG_LEVEL) as LogLevel)
        : LogLevel[process.env.LOG_LEVEL as keyof LogLevel] || LogLevel.DEBUG;
  }

  /**
   * Gets the current timestamp in ISO 8601 format.
   * @returns The current timestamp.
   */
  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Formats a log message with placeholders replaced by their corresponding values.
   * @param level - The log level.
   * @param message - The log message.
   * @param meta - Additional metadata for the log message.
   * @returns The formatted log message.
   */
  private formatMessage(level: LogLevel, message: string, meta: any): string {
    let formattedMessage = this.outputFormat
      .toLocaleLowerCase()
      .replace("{timestamp}", this.getCurrentTimestamp())
      .replace(
        "{level}",
        Object.keys(LogLevel)[Object.values(LogLevel).indexOf(level)]
      )
      .replace("{message}", message);

    if (meta) {
      Object.keys(meta).forEach((key) => {
        const placeholder = `{${key}}`;
        const value = meta[key];

        switch (typeof value) {
          case "string":
            formattedMessage = formattedMessage.replace(placeholder, value);
            break;
          case "number":
            formattedMessage = formattedMessage.replace(
              placeholder,
              value.toString()
            );
            break;
          case "boolean":
            formattedMessage = formattedMessage.replace(
              placeholder,
              value.toString()
            );
            break;
          default:
            formattedMessage = formattedMessage.replace(
              placeholder,
              JSON.stringify(value)
            );
            break;
        }
      });
    }

    return formattedMessage;
  }

  /**
   * Logs a message with the given log level and optional metadata.
   * @param level - The log level.
   * @param message - The log message.
   * @param meta - Additional metadata for the log message.
   */
  private log(level: LogLevel, message: string, ...meta: any): IMessage | void {
    const formattedMessage = this.formatMessage(level, message, meta);
    this.breadcrumbs.push(formattedMessage);

    if (level > this.level) {
      return;
    }

    return this.write(formattedMessage);
  }

  public write(message: string): IMessage  {
    const maxRows = this.stdout.rows || 25
    const messageObject: IMessage = {
      content: message,
      index: this.buffer.length,
      update: (newMessage: string): void => {
        if (messageObject.content === newMessage) {
          return;
        }
        const invertedIndex = this.buffer.length - messageObject.index;
        readline.cursorTo(this.stdout, 0, maxRows - invertedIndex);
        readline.clearLine(this.stdout, 1);
        messageObject.content = newMessage;
        this.stdout.write(`${newMessage}`);
      },
      clear: (): void => {
        const invertedIndex = this.buffer.length - messageObject.index;
        readline.cursorTo(this.stdout, 0, maxRows - invertedIndex);
        readline.clearLine(this.stdout, 1);
      }
    }

    this.buffer = this.buffer.map((messageObject) => ({
      ...messageObject,
      index: messageObject.index
    }));
    this.buffer.push(messageObject);

    readline.cursorTo(this.stdout, 0, maxRows);
    readline.clearLine(this.stdout, 1);
    this.stdout.write(`\n${messageObject.content}`);

    return messageObject;
  }

  /**
   * Profiles a method by measuring its execution time.
   * @template T - The return type of the method.
   * @param method - The method to be profiled.
   * @returns A wrapped version of the method that profiles its execution time.
   */
  async profile<Response extends any = void>(
    method: () => Promise<Response>,
    name?: string
  ): Promise<Response> {
    const animation = new ProgressAnimation(this);
    animation.start(`Profiling method '${name || method.name}'`);
    const start = process.hrtime();
    return method.finally(() => {
      const elapsed = process.hrtime(start);

      const elapsedMs = elapsed[0] * 1000 + elapsed[1] / 1e6;
      const profileMessage = `Method '${
        name || method.name
      }' took ${elapsedMs.toFixed(4)}ms.`;
      animation.stop(profileMessage);
    });
  }

  profileSync<Response extends any = void>(
    method: () => Response,
    name?: string
  ): Response {
    const animation = new ProgressAnimation(this);
    animation.start(`Profiling sync method '${name || method.name}'`);
    const start = process.hrtime();
    const result = method();
    const elapsed = process.hrtime(start);
    const elapsedMs = elapsed[0] * 1000 + elapsed[1] / 1e6;
    const profileMessage = `Method '${
      name || method.name
    }' took ${elapsedMs.toFixed(4)}ms.`;
    animation.stop(profileMessage);
    return result;
  }

  /**
   * Logs a trace message with optional metadata.
   * @param message - The trace message.
   * @param meta - Additional metadata for the log message.
   * @returns A wrapped version of the method that profiles its execution time.
   */
  trace(message: string, ...meta: any): IMessage | void {
    return this.log(LogLevel.TRACE, c.gray(message), ...meta);
  }

  /**
   * Logs a debug message with optional metadata.
   * @param message - The debug message.
   * @param meta - Additional metadata for the log message.
   */
  debug(message: string, ...meta: any): IMessage | void {
    return this.log(LogLevel.DEBUG, c.gray(message), ...meta);
  }

  /**
   * Logs an info message with optional metadata.
   * @param message - The info message.
   * @param meta - Additional metadata for the log message.
   */
  info(message: string, ...meta: any): IMessage | void {
    return this.log(LogLevel.INFO, c.white(message), ...meta);
  }

  /**
   * Logs a warning message with optional metadata.
   * @param message - The warning message.
   * @param meta - Additional metadata for the log message.
   */
  warn(message: string, ...meta: any): IMessage | void {
    return this.log(LogLevel.WARN, c.orange(message), ...meta);
  }

  /**
   * Logs an error message with optional metadata.
   * @param message - The error message.
   * @param meta - Additional metadata for the log message.
   */
  error(message: string, ...meta: any): IMessage | void {
    return this.log(LogLevel.ERROR, c.red(message), ...meta);
  }

  /**
   * Logs a fatal message with optional metadata.
   * @param message - The fatal message.
   * @param meta - Additional metadata for the log message.
   */
  fatal(message: string, ...meta: any): void {
    this.showBreadcrumbs();
    this.log(LogLevel.FATAL, c.red(message), ...meta);
    process.exit(1);
  }

  /**
   * Logs a message at the specified log level with optional metadata.
   * @param level - The log level.
   * @param message - The log message.
   * @param meta - Additional metadata for the log message.
   */
  logAtLevel(
    level: LogLevel,
    message: string,
    ...meta: any
  ): IMessage | void {
    return this.log(level, message, ...meta);
  }

  /**
   * Adds a breadcrumb to the logger's history.
   * @param crum - The breadcrumb to be added.
   */
  addBreadcrumb(crumb: string): void {
    this.breadcrumbs.push(crumb);
  }

  /**
   * Displays the breadcrumbs stored in the logger's history.
   */
  showBreadcrumbs(): void {
    this.breadcrumbs.forEach((breadcrumb, index) => {
      this.log.trace(`${index + 1}. ${breadcrumb}`);
    });
  }
}

export const write = Logger.getInstance().write.bind(Logger.getInstance());
