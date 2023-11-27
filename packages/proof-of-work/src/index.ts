import { SHA256 } from "crypto-js";

class ProofOfWork {
  private static hash(data: string, nonce: number): string {
    return SHA256(data + nonce).toString();
  }

  public static async mine(
    data: string,
    difficulty: number,
    prefix: string = "0",
  ): Promise<[number, string]> {
    if (difficulty < 0) {
      throw new Error("Difficulty must be a non-negative number.");
    }

    let nonce = 0;
    let hash: string;
    const target = prefix.repeat(difficulty);

    do {
      nonce++;
      hash = this.hash(data, nonce);
    } while (!hash.startsWith(target));

    return [nonce, hash];
  }

  public static validate(
    data: string,
    nonce: number,
    difficulty: number,
    hash: string,
    prefix: string = "0",
  ): boolean {
    if (difficulty < 0) {
      throw new Error("Difficulty must be a non-negative number.");
    }

    const validHash = this.hash(data, nonce);
    return validHash === hash && hash.startsWith(prefix.repeat(difficulty));
  }
}

// Example usage
(async () => {
  try {
    const data = "Hello, Proof of Work!";
    const difficulty = 4; // Number of leading zeroes required in the hash
    const [nonce, hash] = await ProofOfWork.mine(data, difficulty);

    console.log(`Nonce: ${nonce}`);
    console.log(`Hash: ${hash}`);

    // Validate the proof of work
    const isValid = ProofOfWork.validate(data, nonce, difficulty, hash);
    console.log(`Is valid: ${isValid}`);
  } catch (error) {
    console.error(error);
  }
})();
