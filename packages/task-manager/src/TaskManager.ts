import { isMainThread } from "worker_threads";
import { PriorityQueue } from "../PriorityQueue/PriorityQueue";
import { WorkerPool } from "../WorkerPool/WorkerPool";
import { ITaskManager } from "./interfaces/ITaskManager";
import { Task } from "./types/Task";
import { Logger } from "../Logger/Logger";

const logger = Logger.getInstance();

/**
 * Represents a task manager that manages and executes tasks concurrently.
 */
export class TaskManager implements ITaskManager {
  private isRunning = false
  private maxConcurrentTasks: number;
  private priorityQueue: PriorityQueue<Task<any, any>>;
  private workerPool: WorkerPool;

  public get size(): number {
    return this.priorityQueue.size;
  }

  /**
   * Creates an instance of TaskManager.
   * @param maxConcurrentTasks The maximum number of tasks that can run concurrently.
   */
  constructor(maxConcurrentTasks = 4) {
    this.maxConcurrentTasks = maxConcurrentTasks;
    this.priorityQueue = new PriorityQueue<Task<any, any>>({
      comparatorFunction: (taskA: Task<any, any>, taskB: Task<any, any>) =>
        taskA.priority - taskB.priority,
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
  public async addTask<Payload extends [], Response extends any = void>(
    method: (payload: Payload) => Promise<Response>,
    priority = 0,
    ...args?: Payload
  ): Promise<Response> {
    try {
      let resolveFn: (value: Response) => void;
      let rejectFn: (error: Error) => void;
      const promise: Promise<Response> = logger.profile(new Promise((resolve, reject) => {
        resolveFn = resolve;
        rejectFn = reject;
      }), 'addTaskPromise');
      const task: Task<Payload, Response> = {
        priority,
        args,
        method,
        resolve: resolveFn,
        reject: rejectFn,
      };

      this.priorityQueue.enqueue(task);
      return promise
    } catch (error) {
      logger.error("Error adding task: " + error);
    }
  }

  /**
   * Executes the next tasks in the queue using the worker pool.
   * @returns A promise that resolves when all tasks are completed.
   */
  public async processTasks(): Promise<void> {
    if (!this.isRunning) {
      return
    }

    try {
      const promises = [];

      for (let i = 0; i < this.maxConcurrentTasks; i++) {
        const task = this.priorityQueue.dequeue();

        if (!task) {
          logger.info("No more tasks to execute.");
          break;
        }

        promises.push(
          this.workerPool
            .executeMethod(task.method, task.args)
            .then(task.resolve)
            .catch(task.reject)
        );
      }

      await logger.profile(Promise.all(promises), "processTasks")

      setTimeout(this.processTasks.bind(this), 1000)
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
