import { ITaskManager } from "./interfaces/ITaskManager.js";
import { Task } from "./types/Task.js";

/** A bounded, in-process priority scheduler for asynchronous work. */
export class TaskManager implements ITaskManager {
  private readonly waiting: Array<Task<unknown, unknown>> = [];
  private active = 0;
  private stopped = false;

  public get size(): number {
    return this.waiting.length;
  }

  public constructor(private readonly maxConcurrentTasks = 4) {
    if (!Number.isInteger(maxConcurrentTasks) || maxConcurrentTasks < 1) {
      throw new RangeError("maxConcurrentTasks must be a positive integer");
    }
  }

  public addTask<Payload, Response>(
    method: (payload: Payload) => Response | Promise<Response>,
    priority = 0,
    args: Payload = undefined as Payload,
  ): Promise<Response> {
    if (this.stopped)
      return Promise.reject(new Error("TaskManager is stopped"));
    return new Promise<Response>((resolve, reject) => {
      this.waiting.push({ method, args, priority, resolve, reject } as Task<
        unknown,
        unknown
      >);
      this.waiting.sort((left, right) => right.priority - left.priority);
      this.pump();
    });
  }

  public destroy(): void {
    this.stopped = true;
    while (this.waiting.length)
      this.waiting.shift()?.reject(new Error("TaskManager is stopped"));
  }

  private pump(): void {
    while (
      !this.stopped &&
      this.active < this.maxConcurrentTasks &&
      this.waiting.length
    ) {
      const task = this.waiting.shift();
      if (!task) return;
      this.active += 1;
      Promise.resolve()
        .then(() => task.method(task.args))
        .then(task.resolve, task.reject)
        .finally(() => {
          this.active -= 1;
          this.pump();
        });
    }
  }
}
