/** Local worker endpoint; network transports must implement an explicit adapter. */
export class Worker<Payload = unknown, Result = unknown> {
  constructor(
    public readonly id: string,
    private readonly handler: (payload: Payload) => Result | Promise<Result>,
  ) {
    if (!id) throw new Error("Worker id must not be empty");
  }
  async execute(payload: Payload): Promise<Result> {
    return this.handler(payload);
  }
}
