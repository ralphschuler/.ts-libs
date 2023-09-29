
/**
 * Represents a task that can be managed by the TaskManager.
 */
export type Task<Payload extends {}, Response extends {}> = {
  priority: number;

  resolve: (value: Response) => void;
  reject: (error: Error) => void;

  method: (payload: Payload) => Promise<Response>;
  args: Payload;
};
