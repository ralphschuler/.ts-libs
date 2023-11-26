/**
 * AssertionError
 * @param {string} message
 * @returns {AssertionError}
 */
export class AssertionError extends Error {
  /**
   * @param {string} message
   */
  constructor(message: string) {
    super(message);
    this.name = "AssertionError";
  }
}
