export class NoKeyPairGeneratedError extends Error {
  constructor() {
    super("No key pair generated. Please generate or load a key pair first.");
    this.name = "NoKeyPairGeneratedError";
  }
}
