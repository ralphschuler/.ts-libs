import OpenAI from "openai";
import {
  Message,
  MessageContent,
  MessageRole,
  MessageSender,
} from "./types/Message.js";
import { AIFunction, AIFunctionCall } from "./types/AIFunction.js";

export class AIFunctionCaller {
  public messages: Message[] = [];
  public functions: AIFunction<any>[];
  private openai: OpenAI;

  constructor(functions: AIFunction<any>[], initialMessages: Message[] = []) {
    this.functions = functions;
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.messages = initialMessages;
  }

  private logMessage(message: Message): void {
    this.messages.push(message);
  }

  private async executeAIModel(): Promise<MessageContent | AIFunctionCall> {
    const response: any = await this.openai.chat.completions.create({
      model: "gpt-4-0613",
      messages: this.messages,
      functions: this.functions,
      function_call: "auto",
    });
    return response.choices[0].message;
  }

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

  public async query(userMessage: string): Promise<any> {
    return await this.processMessage("User", MessageRole.User, userMessage);
  }
}
