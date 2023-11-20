import { Buffer, BufferEncoding } from "node:buffer";

export class Seed extends Buffer {
  [index: number]: number;

  public get length(): number {
    return super.length;
  }

  public set length(value: number) {
    super.length = value;
  }

  constructor(seed?: string | number | Buffer) {
    if (seed === undefined) {
      super(32);
    } else if (typeof seed === "number") {
      super(Buffer.from(seed.toString(16), "hex"));
    } else if (typeof seed === "string") {
      super(Buffer.from(seed, "hex"));
    } else if (Buffer.isBuffer(seed)) {
      super(seed);
    } else {
      throw new Error("[Seed] Invalid seed type");
    }
  }

  public toString(format?: "hex" | "binary"): string {
    return super.toString(format || "hex");
  }

  public toNumber(base: number = 16): number {
    return parseInt(super.toString("hex"), base);
  }
}
