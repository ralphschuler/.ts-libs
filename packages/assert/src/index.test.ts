import assert from "node:assert/strict";
import { it } from "node:test";
import { throws, AssertionError, isDefined, isNotNull } from "./index.js";
it("rejects a callback that does not throw, including custom error messages", () => {
  assert.throws(() => throws(() => {}, "Expected failure"), AssertionError);
  throws(() => {
    throw new Error("expected");
  });
  isDefined(null);
  isNotNull(undefined);
  assert.throws(() => isDefined(undefined), AssertionError);
  assert.throws(() => isNotNull(null), AssertionError);
});
