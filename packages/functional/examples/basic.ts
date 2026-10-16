import assert from "node:assert/strict";
import { Some, match } from "../src/index.js";
assert.equal(match(Some(21), { Some: (value) => value * 2, _: () => 0 }), 42);
