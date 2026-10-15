import assert from "node:assert/strict";
import { it } from "node:test";
import { many, str, everythingUntil } from "./index.js";
import { Parser } from "./parser.js";
it("rejects zero-progress repetition", () => {
  const result = many(Parser.of("constant")).run("abc");
  assert.equal(result.isError, true);
});
it("respects typed array slices and consumes NUL while scanning", () => {
  const bytes = new TextEncoder().encode("xabz").subarray(1, 3);
  const parsed = str("ab").run(bytes);
  assert.equal(parsed.isError, false);
  if (!parsed.isError) assert.equal(parsed.result, "ab");
  const scan = everythingUntil(str("!")).run(new Uint8Array([0, 65, 33]));
  assert.equal(scan.isError, false);
  if (!scan.isError) assert.deepEqual(scan.result, [0, 65]);
});
