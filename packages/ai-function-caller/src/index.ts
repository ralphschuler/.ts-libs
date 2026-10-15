import OpenAI from "openai";
import { MessageRole } from "./types/Message.js";
import type {
  Message,
  MessageContent,
  MessageSender,
} from "./types/Message.js";
import type { AIFunction, AIFunctionCall } from "./types/AIFunction.js";
export interface AIFunctionCallerOptions {
  client?: Pick<OpenAI, "chat">;
  model?: string;
  maxSteps?: number;
}
export class AIFunctionCaller {
  public readonly messages: Message[];
  public readonly functions: AIFunction<any>[];
  private readonly client: Pick<OpenAI, "chat">;
  private readonly history: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  private readonly model: string;
  private readonly maxSteps: number;
  private busy = false;
  constructor(
    functions: AIFunction<any>[],
    initialMessages: Message[] = [],
    options: AIFunctionCallerOptions = {},
  ) {
    if (new Set(functions.map((fn) => fn.name)).size !== functions.length)
      throw new Error("Duplicate function name");
    this.functions = [...functions];
    this.messages = initialMessages.map((message) => ({ ...message }));
    this.history = this.messages.map((message) => ({
      ...message,
      content: message.content ?? "",
    })) as OpenAI.Chat.Completions.ChatCompletionMessageParam[];
    this.client =
      options.client ?? new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.model = options.model ?? "gpt-4.1-mini";
    this.maxSteps = options.maxSteps ?? 6;
    if (
      !Number.isInteger(this.maxSteps) ||
      this.maxSteps < 1 ||
      this.maxSteps > 100
    )
      throw new RangeError("maxSteps must be between 1 and 100");
  }
  async query(userMessage: string, signal?: AbortSignal): Promise<string> {
    if (this.busy) throw new Error("A query is already active");
    if (this.history.length > 200)
      throw new Error("Conversation limit reached");
    this.busy = true;
    const checkpoint = this.history.length;
    this.history.push({ role: "user", content: userMessage });
    try {
      for (let step = 0; step < this.maxSteps; step++) {
        signal?.throwIfAborted();
        const response = await this.client.chat.completions.create(
          {
            model: this.model,
            messages: this.history,
            functions: this.functions.map(
              ({ name, description, parameters }) => ({
                name,
                description,
                parameters,
              }),
            ),
            function_call: "auto",
          },
          { signal },
        );
        const message = response.choices[0]?.message;
        if (!message) throw new Error("The model returned no completion");
        this.history.push({
          role: "assistant",
          content: message.content,
          function_call: message.function_call,
        });
        if (!message.function_call) {
          const content = message.content ?? "";
          this.messages.push(
            { role: MessageRole.User, name: "User", content: userMessage },
            { role: MessageRole.Assistant, name: "Assistant", content },
          );
          return content;
        }
        const call = message.function_call;
        const fn = this.functions.find((entry) => entry.name === call.name);
        if (!fn) throw new Error("Unknown function: " + call.name);
        if (call.arguments.length > 1_000_000)
          throw new Error("Function arguments exceed size limit");
        const args: unknown = JSON.parse(call.arguments);
        if (!args || typeof args !== "object" || Array.isArray(args))
          throw new TypeError("Function arguments must be an object");
        const values = args as Record<string, unknown>;
        for (const key of fn.parameters.required)
          if (!Object.hasOwn(values, key))
            throw new TypeError("Missing argument: " + key);
        for (const [key, value] of Object.entries(values)) {
          const schema = fn.parameters.properties[key];
          if (!schema) throw new TypeError("Unknown argument: " + key);
          if (
            schema.type === "integer"
              ? !Number.isInteger(value)
              : schema.type === "object"
                ? !value || typeof value !== "object" || Array.isArray(value)
                : typeof value !== schema.type
          )
            throw new TypeError("Invalid argument: " + key);
        }
        signal?.throwIfAborted();
        const result = await fn.method(call.arguments);
        const content = JSON.stringify(result) ?? "null";
        if (content.length > 1_000_000)
          throw new Error("Function result exceeds size limit");
        this.history.push({ role: "function", name: fn.name, content });
      }
      throw new Error("Tool-call limit reached");
    } catch (error) {
      this.history.length = checkpoint;
      throw error;
    } finally {
      this.busy = false;
    }
  }
}
export { MessageRole };
export type {
  AIFunction,
  AIFunctionCall,
  Message,
  MessageContent,
  MessageSender,
};
