import assert from "node:assert/strict";
import { BitwiseFeatureFlags } from "../src/index.js";
const permissions = { read: 1, write: 2 } as const;
const flags = new BitwiseFeatureFlags(permissions);
flags.enableFlag(permissions.read);
assert.equal(flags.isFlagEnabled(permissions.read), true);
