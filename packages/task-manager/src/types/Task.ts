/**
 * Represents a task that can be managed by the TaskManager.
 */
export type Task<Payload, Response> = {
  priority: number;

  resolve: (value: Response) => void;
  reject: (error: unknown) => void;

  method: (payload: Payload) => Response | Promise<Response>;
  args: Payload;
};
