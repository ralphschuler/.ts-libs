import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { TaskManager } from "./TaskManager.js";

const mockAsyncFunction = async (payload: any) => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return payload * 2;
};

describe("TaskManager", async () => {
  const taskManager = new TaskManager(4);

  it("should run tasks concurrently", async () => {
    const task1 = taskManager.addTask(mockAsyncFunction, 1, 5);
    const task2 = taskManager.addTask(mockAsyncFunction, 2, 10);
    const task3 = taskManager.addTask(mockAsyncFunction, 3, 15);
    const task4 = taskManager.addTask(mockAsyncFunction, 4, 20);

    const results = await Promise.all([task1, task2, task3, task4]);
    taskManager.destroy();

    assert.strictEqual(results[0], 10);
    assert.strictEqual(results[1], 20);
    assert.strictEqual(results[2], 30);
    assert.strictEqual(results[3], 40);
  });

  it("runs a higher-priority queued task before lower-priority work", async () => {
    const manager = new TaskManager(1);
    const order: string[] = [];
    const gate = new Promise<void>((resolve) => setTimeout(resolve, 10));
    const first = manager.addTask(async () => {
      await gate;
      order.push("first");
      return "first";
    });
    const low = manager.addTask(async () => {
      order.push("low");
      return "low";
    }, 1);
    const high = manager.addTask(async () => {
      order.push("high");
      return "high";
    }, 10);

    await Promise.all([first, low, high]);
    assert.deepStrictEqual(order, ["first", "high", "low"]);
    manager.destroy();
  });

  it("rejects queued work when destroyed", async () => {
    const manager = new TaskManager(1);
    const first = manager.addTask(async () => new Promise<void>(() => {}));
    const queued = manager.addTask(async () => "never");
    manager.destroy();
    await assert.rejects(queued, /stopped/);
    void first.catch(() => {});
  });
});
