/**
 * Represents a guard function that decides if a transition is allowed based on the provided payload.
 * @template Payload The type of payload to be guarded.
 */
export type Guard<Payload = any> = (payload?: Payload) => Promise<boolean> | boolean;