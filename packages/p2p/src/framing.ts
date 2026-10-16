export const MAX_FRAME_BYTES = 1024 * 1024;
export function encodeFrame(data: Buffer): Buffer {
  if (data.length > MAX_FRAME_BYTES)
    throw new RangeError("Frame exceeds 1 MiB");
  const header = Buffer.alloc(4);
  header.writeUInt32BE(data.length);
  return Buffer.concat([header, data]);
}
export class FrameDecoder {
  private pending: Buffer = Buffer.alloc(0);
  read(chunk: Buffer): Buffer[] {
    this.pending = Buffer.concat([this.pending, chunk]);
    const frames: Buffer[] = [];
    while (this.pending.length >= 4) {
      const length = this.pending.readUInt32BE(0);
      if (length > MAX_FRAME_BYTES) throw new RangeError("Frame exceeds 1 MiB");
      if (this.pending.length < length + 4) break;
      frames.push(Buffer.from(this.pending.subarray(4, length + 4)));
      this.pending = Buffer.from(this.pending.subarray(length + 4));
    }
    return frames;
  }
}
