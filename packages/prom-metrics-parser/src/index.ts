export type MetricType =
  | "counter"
  | "gauge"
  | "histogram"
  | "summary"
  | "untyped";
export interface Sample {
  name: string;
  labels: Record<string, string>;
  value: number;
  timestamp?: number;
}
export interface Metric {
  name: string;
  type: MetricType;
  help: string;
  samples: Sample[];
}
const metricTypes = new Set([
  "counter",
  "gauge",
  "histogram",
  "summary",
  "untyped",
]);

export function parseLabels(text: string): Record<string, string> {
  const labels: Record<string, string> = Object.create(null);
  const pattern =
    /\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*"((?:\\["\\n]|[^"\\])*)"\s*(?:,|$)/y;
  let cursor = 0;
  while (cursor < text.length) {
    pattern.lastIndex = cursor;
    const match = pattern.exec(text);
    if (!match) throw new Error("Invalid label at position " + cursor);
    if (Object.hasOwn(labels, match[1]))
      throw new Error("Duplicate label: " + match[1]);
    labels[match[1]] = JSON.parse('"' + match[2] + '"');
    cursor = pattern.lastIndex;
  }
  return labels;
}
export function parseSample(line: string): Sample {
  const match =
    /^([a-zA-Z_:][a-zA-Z0-9_:]*)(?:\{((?:[^"{}]|"(?:\\.|[^"\\])*")*)\})?\s+(\S+)(?:\s+(-?\d+))?$/.exec(
      line.trim(),
    );
  if (!match) throw new Error("Invalid sample line");
  const [, name, labels, raw, timestamp] = match;
  if (
    !/^(?:[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|NaN|[+-]?Inf)$/.test(
      raw,
    )
  )
    throw new Error("Invalid metric value: " + raw);
  const value =
    raw === "NaN"
      ? NaN
      : /^[+]?Inf$/.test(raw)
        ? Infinity
        : raw === "-Inf"
          ? -Infinity
          : Number(raw);
  return {
    name,
    labels: labels === undefined ? {} : parseLabels(labels),
    value,
    ...(timestamp === undefined ? {} : { timestamp: Number(timestamp) }),
  };
}
export function parsePrometheusMetrics(text: string): Metric[] {
  const families = new Map<string, Metric>();
  const family = (name: string) => {
    if (!families.has(name))
      families.set(name, { name, type: "untyped", help: "", samples: [] });
    return families.get(name)!;
  };
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const directive = /^# (HELP|TYPE) ([a-zA-Z_:][a-zA-Z0-9_:]*)\s+(.+)$/.exec(
      line,
    );
    if (directive) {
      const [, kind, name, value] = directive;
      if (kind === "TYPE") {
        if (!metricTypes.has(value))
          throw new Error("Invalid metric type: " + value);
        family(name).type = value as MetricType;
      } else
        family(name).help = value.replace(/\\n/g, "\n").replace(/\\\\/g, "\\");
      continue;
    }
    if (line.startsWith("#")) continue;
    const sample = parseSample(line);
    const base = [...families.keys()]
      .sort((a, b) => b.length - a.length)
      .find(
        (name) =>
          sample.name === name ||
          ["_bucket", "_sum", "_count"].some(
            (suffix) => sample.name === name + suffix,
          ),
      );
    family(base ?? sample.name).samples.push(sample);
  }
  return [...families.values()];
}
