import { Buffer } from "node:buffer";

export class Seed {
  private _buffer: Buffer;

  constructor(seed?: string | number | Buffer | Uint8Array) {
    if (seed === undefined) {
      this._buffer = Buffer.alloc(32);
    } else if (typeof seed === "number") {
      if (!Number.isSafeInteger(seed) || seed < 0)
        throw new RangeError("Seed must be a non-negative safe integer");
      const hex = seed.toString(16);
      this._buffer = Buffer.from(
        hex.padStart(Math.ceil(hex.length / 2) * 2, "0"),
        "hex",
      );
    } else if (typeof seed === "string") {
      if (!/^[0-9a-f]+$/i.test(seed))
        throw new Error("Seed must contain hexadecimal digits");
      this._buffer = Buffer.from(
        seed.padStart(Math.ceil(seed.length / 2) * 2, "0"),
        "hex",
      );
    } else if (Buffer.isBuffer(seed) || seed instanceof Uint8Array) {
      this._buffer = Buffer.from(seed);
    } else {
      throw new Error("[Seed] Invalid seed type");
    }
  }

  public get buffer(): Buffer {
    return this._buffer;
  }

  public get length(): number {
    return this._buffer.length;
  }

  public toString(format?: "hex" | "binary"): string {
    return this._buffer.toString(format || "hex");
  }

  public toNumber(base: number = 16): number {
    return parseInt(this._buffer.toString("hex"), base);
  }

  [index: number]: number;

  public get(index: number): number {
    return this._buffer[index];
  }

  public set(index: number, value: number): void {
    this._buffer[index] = value;
  }
}
