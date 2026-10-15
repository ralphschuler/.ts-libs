import assert from "node:assert/strict";
import { it } from "node:test";
import { parsePrometheusMetrics, parseSample } from "./index.js";
it("separates families, metadata, escaped labels and special numeric values", () => {
  const result = parsePrometheusMetrics(
    '# HELP requests Request count\n# TYPE requests counter\nrequests{path="a,b=c",message="say \\"hi\\""} 2\n# TYPE latency histogram\nlatency_bucket{le="+Inf"} +Inf\nlatency_sum 3e2',
  );
  assert.equal(result.length, 2);
  assert.equal(result[0].type, "counter");
  assert.equal(result[0].samples[0].labels.path, "a,b=c");
  assert.equal(result[0].samples[0].labels.message, 'say "hi"');
  assert.equal(result[1].samples[0].value, Infinity);
  assert.equal(result[1].samples[1].value, 300);
  assert.ok(Number.isNaN(parseSample("value NaN").value));
  assert.throws(() => parseSample("value 123garbage"), /Invalid metric value/);
});
