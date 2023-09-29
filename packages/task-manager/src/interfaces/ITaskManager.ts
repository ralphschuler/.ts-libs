import { Task } from "../types/Task.js";

/**
 * Represents the interface for a task manager.
 */
export interface ITaskManager {
  /**
   * Adds a task to the task manager.
   * @param method The method to be executed as a task.
   * @param args The arguments for the method.
   * @param priority The priority of the task.
   * @returns The created task.
   */
  addTask<Payload extends {}, Response extends {}>(
    method: (payload: Payload) => Promise<Response>,
    priority?: number,
    args?: Payload,
  ): Promise<Task<Payload, Response>>;
}
