import assert from "node:assert/strict";
import { it } from "node:test";
import {
  Some,
  None,
  Ok,
  Err,
  isSome,
  isNone,
  isOk,
  isErr,
  match,
} from "./index.js";
it("represents falsy values and dispatches result variants explicitly", () => {
  assert.equal(isSome(Some(0)), true);
  assert.equal(isNone(None()), true);
  assert.equal(isOk(Ok(false)), true);
  assert.equal(isErr(Err("failure")), true);
  assert.equal(match(Some(3), { Some: (n) => n * 2, _: () => 0 }), 6);
  assert.equal(Object.isFrozen(Some(1)), true);
});
