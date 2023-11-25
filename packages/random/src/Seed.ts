import { Buffer } from "node:buffer";

export class Seed {
  private _buffer: Buffer;

  constructor(seed?: string | number | Buffer | Uint8Array) {
    if (seed === undefined) {
      this._buffer = Buffer.alloc(32);
    } else if (typeof seed === "number") {
      this._buffer = Buffer.from(seed.toString(16), "hex");
    } else if (typeof seed === "string") {
      this._buffer = Buffer.from(seed, "hex");
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
