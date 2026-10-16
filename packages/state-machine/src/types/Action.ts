/**
 * Represents an action that can be performed.
 * @template Payload The type of payload accepted by the action.
 * @returns True if the action was performed successfully, false otherwise.
 */
export type Action<Payload, Response> = (
  payload?: Payload,
) => Promise<Response> | Response;
