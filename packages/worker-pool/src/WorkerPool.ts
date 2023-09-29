import { Worker } from "worker_threads";
import { Task } from "./types/Task.js";
import { Logger } from "@lib-lib/logger";

const logger = Logger.getInstance();

/**
 * A pool of workers that can execute tasks in parallel.
 */
export class WorkerPool {
  private poolSize: number;
  private idleWorkers: Worker[] = [];
  private idleTasks: Task<any, any>[] = [];
  private activeTasks: Task<any, any>[] = [];
  private taskCounter: number = 0;

  public get size(): number {
    return this.poolSize;
  }

  public get taskIndex(): number {
    return this.taskCounter++;
  }

  /**
   * Creates a new WorkerPool instance.
   * @param {number} poolSize - The number of workers in the pool.
   * @throws {Error} If instantiated in the main thread.
   */
  constructor(poolSize: number) {
    this.poolSize = poolSize;
    logger.profileSync(this.initializeWorkers.bind(this), "initializeWorkers");
  }

  /**
   * Generates the script that the worker thread will run.
   * @returns {string} The worker script as a string.
   * @private
   */
  private static workerScript(): string {
    return `const { parentPort } = require("worker_threads");

    parentPort.on("message", async function ({ id, method, args }) {
      let timeoutId = setTimeout(() => parentPort.postMessage({ id, error: new Error("Worker Timeout") }), 1000 * 60 * 5)
      try {
        const fn = new Function(\`return \${method}\`)();
        const result = args ? await fn(...args) : await fn();
        parentPort.postMessage({ id, result });
        clearTimeout(timeoutId)
      } catch (error) {
        parentPort.postMessage({ id, error });
        clearTimeout(timeoutId)
      }
    });`;
  }

  /**
   * Initializes worker threads and adds them to the idle workers list.
   * Workers listen for messages and errors.
   * @private
   */
  private initializeWorkers() {
    try {
      for (let i = 0; i < this.poolSize; i++) {
        logger.profileSync(() => this.createWorker(i), "createWorker");
      }
    } catch (error) {
      logger.error("Error initializing workers: " + error);
    }
  }

  /**
   * Creates a new worker thread and adds it to the idle workers list.
   * @private
   */
  private createWorker(i: number): void {
    try {
      const script = WorkerPool.workerScript();
      const worker = new Worker(script, { eval: true });

      worker.on("message", (message: any) =>
        logger.profileSync(
          () => this.handleWorkerResponse(message, worker),
          "handleWorkerResponse",
        ),
      );
      worker.on("error", (error: Error) =>
        logger.profileSync(
          () => this.handleWorkerError(error, worker),
          "handleWorkerError",
        ),
      );

      this.idleWorkers.push(worker);
    } catch (error) {
      logger.error("Error creating worker: " + error);
    }
  }

  /**
   * Handles a task message received from a worker.
   * @param {object} message - The message received from the worker.
   * @param {Worker} worker - The worker processing the task.
   * @private
   */
  private async handleWorkerResponse(
    { id, result, error }: any,
    worker: Worker,
  ): Promise<void> {
    try {
      const task = this.activeTasks.find((t) => t.id === id);
      if (!task) {
        logger.error(
          "Task with id " +
            id +
            " does not exist active tasks " +
            this.activeTasks.length,
        );
        return;
      }

      if (result) {
        task.resolve(result);
      } else if (error) {
        task.reject(error);
      }

      this.activeTasks = this.activeTasks.filter((t) => t.id !== id);
    } catch (error) {
      logger.error("Error handling message: " + error);
    } finally {
      logger.profileSync(() => this.releaseWorker(worker), "releaseWorker");
    }
  }

  /**
   * Handles errors that occur in worker threads.
   * @param {Error} error - The error that occurred.
   * @param {Worker} worker - The worker where the error occurred.
   * @private
   */
  private handleWorkerError(error: Error, worker: Worker): void {
    logger.error(`Error in worker ${worker.threadId}: ${error}`);
  }

  /**
   * Gets an idle worker from the pool.
   * @returns {Worker | undefined} An idle worker, if available.
   * @private
   */
  private getWorker(): Worker | undefined {
    return this.idleWorkers.pop();
  }

  /**
   * Releases a worker back to the pool or assigns it a new task.
   * @param {Worker} worker - The worker to release.
   * @private
   */
  private releaseWorker(worker: Worker): void {
    try {
      const task = this.idleTasks.shift();
      if (task) {
        logger.info(
          `Assigning task with id ${task.id} to worker ${worker.threadId}...`,
        );
        this.activeTasks.push(task);
        worker.postMessage({
          id: task.id,
          method: task.method,
          args: task.args,
        });
      } else {
        logger.info(`Worker ${worker.threadId} is idle.`);
      }
    } catch (error) {
      logger.error("Error releasing worker: " + error);
    } finally {
      this.idleWorkers.push(worker);
    }
  }

  /**
   * Executes a method using an available worker or queues it for later.
   * @param {() => Promise<Output>} method - The method to execute.
   * @returns {Promise<Output>} A promise that resolves with the method's output.
   */
  public async executeMethod<Payload extends [], Response extends any = void>(
    method: (...args: Payload) => Promise<Response>,
    args: Payload,
  ): Promise<Response> {
    try {
      let resolveFn: (value: Response) => void;
      let rejectFn: (error: Error) => void;
      const worker = this.getWorker();
      const promise: Promise<Response> = new Promise((resolve, reject) => {
        resolveFn = resolve;
        rejectFn = reject;
      });
      const task: Task<Payload, Response> = {
        id: this.taskIndex,
        resolve: resolveFn!,
        reject: rejectFn!,
        method: method,
        args: args,
      };

      if (worker) {
        logger.info(`Assigning task to worker ${worker.threadId}...`);
        this.activeTasks.push(task);
        worker.postMessage({
          id: task.id,
          method: task.method,
          args: task.args,
        });
      } else {
        logger.info("No idle workers available. Queuing task...");
        this.idleTasks.push(task);
      }

      return logger.profile(promise, "executeMethod");
    } catch (error) {
      logger.error("Error executing method: " + error);
      throw error;
    }
  }

  /**
   * Terminates all workers in the pool.
   */
  public destroy(): void {
    try {
      this.idleWorkers.forEach((worker) => worker.terminate());
    } catch (error) {
      logger.error("Error destroying worker pool: " + error);
    }
  }
}
