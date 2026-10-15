/**
 * Represents a task to be executed in a worker.
 */
export type Task<Payload extends unknown[], Response> = {
  id: any;
  resolve: (value: Response) => void;
  reject: (error: Error) => void;
  method: (...args: Payload) => Promise<Response>;
  args: Payload;
};
