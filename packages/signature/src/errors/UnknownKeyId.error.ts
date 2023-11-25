export class UnknownKeyIdError extends Error {
  constructor(knownKeyIds: string[], keyId: string) {
    super(`Unknown key id ${keyId}. Known key ids: ${knownKeyIds.join(", ")}`);
    this.name = "UnknownKeyIdError";
  }
}
