import OpenAI from "openai";
import {
  Message,
  MessageContent,
  MessageRole,
  MessageSender,
} from "./types/Message.js";
import { AIFunction, AIFunctionCall } from "./types/AIFunction.js";

/**
 * A class for calling AI functions and managing interactions.
 */
export class AIFunctionCaller {
  public messages: Message[] = [];
  public functions: AIFunction<any>[];
  private openai: OpenAI;

  /**
   * Constructs an AIFunctionCaller instance.
   * @param functions - Array of AI functions.
   * @param initialMessages - Initial set of messages, defaults to an empty array.
   */
  constructor(functions: AIFunction<any>[], initialMessages: Message[] = []) {
    this.functions = functions;
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.messages = initialMessages;
  }

  /**
   * Logs a message to the message array.
   * @param message - The message to log.
   */
  private logMessage(message: Message): void {
    this.messages.push(message);
  }

  /**
   * Executes the AI model and returns the response.
   * @returns A Promise resolving to MessageContent or AIFunctionCall.
   */
  private async executeAIModel(): Promise<MessageContent | AIFunctionCall> {
    const response: any = await this.openai.chat.completions.create({
      model: "gpt-4-0613",
      messages: this.messages,
      functions: this.functions,
      function_call: "auto",
    });
    return response.choices[0].message;
  }

  /**
   * Processes an AI function call and returns the response.
   * @param aiFunctionCall - The AI function call to process.
   * @returns A Promise resolving to MessageContent or AIFunctionCall.
   */
  private async processAiFunctionCall(
    aiFunctionCall: AIFunctionCall,
  ): Promise<MessageContent | AIFunctionCall> {
    const { name, arguments: args } = aiFunctionCall;
    const { method } = this.functions.find(
      (f) => f.name === name,
    ) as AIFunction<any>;
    const functionResponse = await method(args);
    return this.processMessage(
      "Function",
      MessageRole.Function,
      functionResponse,
    );
  }

  /**
   * Processes a message, logs it, and returns the AI model's response.
   * @param sender - The sender of the message.
   * @param role - The role of the message sender.
   * @param content - The content of the message.
   * @returns A Promise resolving to MessageContent or AIFunctionCall.
   */
  private async processMessage(
    sender: MessageSender,
    role: MessageRole,
    content: MessageContent | AIFunctionCall,
  ): Promise<MessageContent | AIFunctionCall> {
    this.logMessage({ role, name: sender, content: String(content) });
    const modelResponse = await this.executeAIModel();
    this.logMessage({
      role: MessageRole.Assistant,
      name: "Assistant",
      content: String(modelResponse),
    });
    return modelResponse;
  }

  /**
   * Processes a user query and returns the response.
   * @param userMessage - The user message to process.
   * @returns A Promise resolving to the response.
   */
  public async query(userMessage: string): Promise<any> {
    return await this.processMessage("User", MessageRole.User, userMessage);
  }
}

export {
  AIFunction,
  AIFunctionCall,
  Message,
  MessageContent,
  MessageRole,
  MessageSender,
};
