import assert from "node:assert/strict";
import { it } from "node:test";
import { FrameDecoder, encodeFrame, MAX_FRAME_BYTES } from "./framing.js";
it("reassembles split and coalesced TCP frames and rejects oversized lengths", () => {
  const decoder = new FrameDecoder();
  const frame = encodeFrame(Buffer.from("hello"));
  assert.deepEqual(decoder.read(frame.subarray(0, 2)), []);
  const frames = decoder.read(
    Buffer.concat([frame.subarray(2), encodeFrame(Buffer.from("again"))]),
  );
  assert.deepEqual(
    frames.map((value) => value.toString()),
    ["hello", "again"],
  );
  const bad = Buffer.alloc(4);
  bad.writeUInt32BE(MAX_FRAME_BYTES + 1);
  assert.throws(() => new FrameDecoder().read(bad), /exceeds/);
});
