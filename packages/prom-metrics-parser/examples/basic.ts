import assert from "node:assert/strict";
import { parsePrometheusMetrics } from "../src/index.js";
const metrics = parsePrometheusMetrics("# TYPE calls counter\ncalls 42");
assert.equal(metrics[0].samples[0].value, 42);
