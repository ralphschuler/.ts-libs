import { TaskState } from "./TaskState";

/**
 * Represents a task that can be managed by the TaskManager.
 */
export type Task<Payload  extends [], Response extends any> = {
  priority: number;

  resolve: (value: Output) => void;
  reject: (error: Error) => void;

  method: (payload: Payload) => Promise<Response>;
  args: Payload;
};
