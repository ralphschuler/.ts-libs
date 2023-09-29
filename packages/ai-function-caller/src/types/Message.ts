import { AIFunctionCall } from "./AIFunction.js";

export type Message = {
  role: MessageRole;
  name: MessageSender;
  content: MessageContent | null;
  function_call?: AIFunctionCall
};
export type MessageContent = string;
export enum MessageRole {
  Function = "function",
  System = "system",
  User = "user",
  Assistant = "assistant",
}
export type MessageSender = string;
