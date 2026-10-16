import assert from "node:assert/strict";
import { it } from "node:test";
import { BitwiseFeatureFlags } from "./index.js";
enum Permission {
  Read = 1,
  Write = 2,
  Invalid = 3,
}
it("ignores numeric-enum reverse mappings and rejects compound flags", () => {
  const flags = new BitwiseFeatureFlags(Permission);
  flags.enableFlag(Permission.Read);
  assert.equal(flags.isFlagEnabled(Permission.Read), true);
  assert.equal(flags.isFlagEnabled(Permission.Write), false);
  flags.disableFlag(Permission.Read);
  assert.equal(flags.isFlagEnabled(Permission.Read), false);
  assert.throws(() => flags.enableFlag(Permission.Invalid), RangeError);
});
