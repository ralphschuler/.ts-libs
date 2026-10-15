import assert from "node:assert/strict";
import { noThrow, isError } from "../src/index.js";
const result = await noThrow(async () => {
  throw new Error("Expected example failure");
});
assert.equal(isError(result), true);
