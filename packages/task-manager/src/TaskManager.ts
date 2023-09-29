import { MemoryPriorityQueue } from "@lib-lib/priority-queue";
import { WorkerPool } from "@lib-lib/worker-pool";
import { ITaskManager } from "./interfaces/ITaskManager.js";
import { Task } from "./types/Task.js";
import { Logger } from "@lib-lib/logger";

const logger = Logger.getInstance();

/**
 * Represents a task manager that manages and executes tasks concurrently.
 */
export class TaskManager implements ITaskManager {
  private isRunning = false;
  private maxConcurrentTasks: number;
  private priorityQueue: MemoryPriorityQueue<Task<any, any>>;
  private workerPool: WorkerPool;

  public get size(): number {
    return this.priorityQueue.length;
  }

  /**
   * Creates an instance of TaskManager.
   * @param maxConcurrentTasks The maximum number of tasks that can run concurrently.
   */
  constructor(maxConcurrentTasks = 4) {
    this.maxConcurrentTasks = maxConcurrentTasks;
    this.priorityQueue = new MemoryPriorityQueue<Task<any, any>>({
      comparatorFunction: (taskA: Task<any, any>, taskB: Task<any, any>) =>
        Promise.resolve(taskA.priority - taskB.priority),
    });
    this.workerPool = new WorkerPool(this.maxConcurrentTasks);

    this.isRunning = true;
    this.processTasks();
  }

  /**
   * Adds a task to the task manager.
   * @param method The method to be executed as a task.
   * @param args The arguments for the method.
   * @param priority The priority of the task.
   * @returns The created task.
   */
  public async addTask<Payload extends {}, Response extends {}>(
    method: (payload: Payload) => Promise<Response>,
    priority?: number,
    args?: Payload
  ): Promise<Task<Payload, Response>> {
    try {
      let resolveFn: (value: Response) => void = () => {};
      let rejectFn: (error: Error) => void = () => {};
      const promise: Promise<Response> = new Promise((resolve, reject) => {
        resolveFn = resolve;
        rejectFn = reject;
      });
      const task: Task<Payload, Response> = {
        priority: priority || 0,
        args: args || ({} as Payload),
        method,
        resolve: resolveFn,
        reject: rejectFn,
      };

      await this.priorityQueue.enqueue(task);
      await logger.profile(promise, "addTask");
      return task;
    } catch (error) {
      logger.error("Error adding task: " + error);
      throw error;
    }
  }

  /**
   * Executes the next tasks in the queue using the worker pool.
   * @returns A promise that resolves when all tasks are completed.
   */
  public async processTasks(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    try {
      const promises = [];

      for (let i = 0; i < this.maxConcurrentTasks; i++) {
        const task = await this.priorityQueue.dequeue();

        if (!task) {
          logger.info("No more tasks to execute.");
          break;
        }

        promises.push(
          this.workerPool
            .executeMethod(task.method, task.args)
            .then(task.resolve)
            .catch(task.reject),
        );
      }

      await logger.profile(Promise.all(promises), "processTasks");

      setTimeout(this.processTasks.bind(this), 1000);
    } catch (error) {
      logger.error("Error processing tasks: " + error);
    }
  }

  /**
   * Destroys the task manager.
   */
  public destroy(): void {
    try {
      this.isRunning = false;
      this.workerPool.destroy();
      this.priorityQueue.clear();
    } catch (error) {
      logger.error("Error destroying task manager: " + error);
    }
  }
}
