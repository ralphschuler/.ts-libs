import assert from "node:assert/strict";
import { it } from "node:test";
import { parseLabels, parsePrometheusMetrics, parseSample } from "./index.js";
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
it("scans long labels and directives and rejects malformed input without backtracking", () => {
  const large = "a".repeat(100_000);
  assert.equal(parseLabels(`name="${large}"`).name, large);
  assert.throws(() => parseLabels(" ".repeat(100_000) + "?"), /Invalid label/);
  assert.throws(() => parseLabels(large), /assignment/);
  assert.throws(() => parseSample(`value{label="${large}`), /Unterminated/);
  assert.equal(parsePrometheusMetrics(`# HELP metric ${large}`)[0].help, large);
  assert.throws(
    () => parsePrometheusMetrics("# HELP : " + " ".repeat(100_000)),
    /directive/,
  );
  assert.deepEqual(
    { ...parseLabels('a="}",b="\\\\n",') },
    { a: "}", b: "\\n" },
  );
  assert.equal(parseSample("value 1 123").timestamp, 123);
  assert.throws(() => parseSample("value 1 123 extra"), /timestamp/);
  assert.throws(() => parseLabels('a="x",a="y"'), /Duplicate/);
  assert.throws(() => parseLabels('a="\\q"'), /escape/);
});
