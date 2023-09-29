import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { TaskManager } from "./TaskManager";

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
});
