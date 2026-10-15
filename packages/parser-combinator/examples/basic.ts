import assert from "node:assert/strict";
import { str, many } from "../src/index.js";
const result = many(str("ab")).run("abab!");
assert.equal(result.isError, false);
if (!result.isError) assert.deepEqual(result.result, ["ab", "ab"]);
