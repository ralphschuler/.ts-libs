import { Worker } from "node:worker_threads";

type PendingTask = {
  id: number;
  method: string;
  args: unknown[];
  resolve: (value: any) => void;
  reject: (error: unknown) => void;
};
type Slot = {
  worker: Worker;
  task?: PendingTask;
  timer?: ReturnType<typeof setTimeout>;
};
export interface WorkerPoolOptions {
  maxQueueSize?: number;
  taskTimeoutMs?: number;
}

/**
 * Executes trusted, self-contained functions in worker threads.
 * Function source cannot capture closures and must never come from untrusted input.
 */
export class WorkerPool {
  private readonly workers = new Set<Slot>();
  private readonly waiting: PendingTask[] = [];
  private counter = 0;
  private stopped = false;
  private readonly maxQueueSize: number;
  private readonly taskTimeoutMs: number;

  constructor(
    private readonly poolSize: number,
    options: WorkerPoolOptions = {},
  ) {
    if (!Number.isInteger(poolSize) || poolSize < 1)
      throw new RangeError("poolSize must be positive");
    this.maxQueueSize = options.maxQueueSize ?? 1000;
    this.taskTimeoutMs = options.taskTimeoutMs ?? 30_000;
    if (
      !Number.isInteger(this.maxQueueSize) ||
      this.maxQueueSize < 0 ||
      !Number.isFinite(this.taskTimeoutMs) ||
      this.taskTimeoutMs <= 0
    )
      throw new RangeError("Invalid queue capacity or task timeout");
    for (let i = 0; i < poolSize; i++) this.createWorker();
  }
  get size(): number {
    return this.workers.size;
  }
  get taskIndex(): number {
    return this.counter++;
  }

  private createWorker(): void {
    const worker = new Worker(
      `
      const {parentPort} = require("node:worker_threads");
      parentPort.on("message", async ({id, method, args}) => {
        try {
          const fn = (0,eval)("(" + method + ")");
          const result = await fn(...args);
          parentPort.postMessage({id,ok:true,result});
        } catch(error) {
          parentPort.postMessage({id,ok:false,error:{name:error?.name || "Error",message:error?.message || String(error)}});
        }
      });
    `,
      { eval: true, execArgv: [] },
    );
    const slot: Slot = { worker };
    this.workers.add(slot);
    worker.on("message", (message) => {
      if (!slot.task || message.id !== slot.task.id) return;
      const task = slot.task;
      clearTimeout(slot.timer);
      slot.task = undefined;
      if (message.ok) task.resolve(message.result);
      else
        task.reject(
          Object.assign(new Error(message.error.message), {
            name: message.error.name,
          }),
        );
      this.pump();
    });
    worker.on("error", (error) => this.retire(slot, error));
    worker.on("exit", (code) => {
      if (this.workers.has(slot))
        this.retire(slot, new Error("Worker exited with code " + code));
    });
  }

  private retire(slot: Slot, error: Error): void {
    if (!this.workers.delete(slot)) return;
    clearTimeout(slot.timer);
    slot.task?.reject(error);
    void slot.worker.terminate();
    if (!this.stopped) {
      this.createWorker();
      this.pump();
    }
  }

  private pump(): void {
    if (this.stopped) return;
    for (const slot of this.workers) {
      if (slot.task || !this.waiting.length) continue;
      const task = this.waiting.shift()!;
      slot.task = task;
      slot.timer = setTimeout(
        () => this.retire(slot, new Error("Worker task timed out")),
        this.taskTimeoutMs,
      );
      try {
        slot.worker.postMessage({
          id: task.id,
          method: task.method,
          args: task.args,
        });
      } catch (error) {
        clearTimeout(slot.timer);
        slot.task = undefined;
        task.reject(error);
        // Continue assigning pending work to this now idle worker.
        this.pump();
      }
    }
  }

  executeMethod<Payload extends unknown[] = [], Response = unknown>(
    method: (...args: Payload) => Response | Promise<Response>,
    args: Payload = [] as unknown as Payload,
  ): Promise<Response> {
    if (this.stopped)
      return Promise.reject(new Error("Worker pool is stopped"));
    const available = [...this.workers].some((slot) => !slot.task);
    if (!available && this.waiting.length >= this.maxQueueSize)
      return Promise.reject(new Error("Worker queue is full"));
    return new Promise((resolve, reject) => {
      this.waiting.push({
        id: this.taskIndex,
        method: method.toString(),
        args,
        resolve,
        reject,
      });
      this.pump();
    });
  }

  async destroy(): Promise<void> {
    if (this.stopped) return;
    this.stopped = true;
    const error = new Error("Worker pool is stopped");
    for (const task of this.waiting.splice(0)) task.reject(error);
    const slots = [...this.workers];
    this.workers.clear();
    for (const slot of slots) {
      clearTimeout(slot.timer);
      slot.task?.reject(error);
    }
    await Promise.all(slots.map((slot) => slot.worker.terminate()));
  }
}
