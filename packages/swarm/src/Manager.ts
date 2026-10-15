import { Worker } from "./Worker.js";
export type ManagerParams = { maxNodes?: number };
export class Manager<Payload = unknown, Result = unknown> {
  private readonly nodes = new Map<string, Worker<Payload, Result>>();
  private readonly maxNodes: number;
  constructor({ maxNodes = 100 }: ManagerParams = {}) {
    if (!Number.isInteger(maxNodes) || maxNodes < 1)
      throw new RangeError("maxNodes must be positive");
    this.maxNodes = maxNodes;
  }
  registerNode(node: Worker<Payload, Result>): void {
    if (this.nodes.has(node.id))
      throw new Error("Duplicate worker id: " + node.id);
    if (this.nodes.size >= this.maxNodes)
      throw new Error("Worker limit reached");
    this.nodes.set(node.id, node);
  }
  unregisterNode(id: string): boolean {
    return this.nodes.delete(id);
  }
  async broadcast(payload: Payload): Promise<PromiseSettledResult<Result>[]> {
    return Promise.allSettled(
      [...this.nodes.values()].map((node) => node.execute(payload)),
    );
  }
}
