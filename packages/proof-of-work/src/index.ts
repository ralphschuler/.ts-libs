import { createHash } from "node:crypto";
import { setImmediate } from "node:timers/promises";

/** A deliberately small proof-of-work primitive for demonstrations and tests. */
export class ProofOfWork {
  private static hash(data: string, nonce: number): string {
    return createHash("sha256")
      .update(JSON.stringify([data, nonce]))
      .digest("hex");
  }

  public static async mine(
    data: string,
    difficulty: number,
    prefix = "0",
    signal?: AbortSignal,
  ): Promise<[number, string]> {
    this.validateDifficulty(difficulty, prefix);
    const target = prefix.repeat(difficulty);
    for (let nonce = 1; ; nonce += 1) {
      if (signal?.aborted) {
        const error = new Error("Proof-of-work mining was aborted");
        error.name = "AbortError";
        throw signal.reason ?? error;
      }
      const hash = this.hash(data, nonce);
      if (hash.startsWith(target)) return [nonce, hash];
      if (nonce % 1_000 === 0) await setImmediate();
    }
  }

  public static validate(
    data: string,
    nonce: number,
    difficulty: number,
    hash: string,
    prefix = "0",
  ): boolean {
    this.validateDifficulty(difficulty, prefix);
    return (
      Number.isSafeInteger(nonce) &&
      nonce >= 0 &&
      this.hash(data, nonce) === hash &&
      hash.startsWith(prefix.repeat(difficulty))
    );
  }

  private static validateDifficulty(difficulty: number, prefix: string): void {
    if (
      !Number.isInteger(difficulty) ||
      difficulty < 0 ||
      !/^[0-9a-f]+$/.test(prefix) ||
      difficulty * prefix.length > 64
    ) {
      throw new RangeError(
        "difficulty must be a non-negative integer and prefix must not be empty",
      );
    }
  }
}
