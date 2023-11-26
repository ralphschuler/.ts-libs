import { AIFunctionCall } from "./AIFunction.js";

/**
 * Represents a message in the system.
 */
export type Message = {
  /** The role of the message sender. */
  role: MessageRole;
  /** The name of the message sender. */
  name: MessageSender;
  /** The content of the message, which can be null. */
  content: MessageContent | null;
  /** Optional AI function call associated with the message. */
  function_call?: AIFunctionCall;
};

/**
 * Defines the content of a message, represented as a string.
 */
export type MessageContent = string;

/**
 * Enumerates the possible roles of a message sender.
 */
export enum MessageRole {
  /** Represents a function's message. */
  Function = "function",
  /** Represents a system's message. */
  System = "system",
  /** Represents a user's message. */
  User = "user",
  /** Represents an assistant's message. */
  Assistant = "assistant",
}

/**
 * Represents the sender of a message, identified by a string.
 */
export type MessageSender = string;
