export type MetricType =
  "counter" | "gauge" | "histogram" | "summary" | "untyped";
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

const whitespace = (character: string | undefined) =>
  character === " " || character === "\t";
const nameCharacter = (character: string | undefined) =>
  character !== undefined && /^[a-zA-Z0-9_:]$/.test(character);

export function parseLabels(text: string): Record<string, string> {
  const labels: Record<string, string> = Object.create(null);
  let cursor = 0;
  const skipSpace = () => {
    while (whitespace(text[cursor])) cursor++;
  };
  skipSpace();
  while (cursor < text.length) {
    const start = cursor;
    while (nameCharacter(text[cursor])) cursor++;
    const name = text.slice(start, cursor);
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name))
      throw new Error("Invalid label at position " + start);
    skipSpace();
    if (text[cursor++] !== "=") throw new Error("Expected label assignment");
    skipSpace();
    if (text[cursor++] !== '"') throw new Error("Expected quoted label");
    let value = "";
    let closed = false;
    while (cursor < text.length) {
      const character = text[cursor++];
      if (character === '"') {
        closed = true;
        break;
      }
      if (character === "\\") {
        const escaped = text[cursor++];
        if (escaped === "n") value += "\n";
        else if (escaped === '"' || escaped === "\\") value += escaped;
        else throw new Error("Invalid label escape");
      } else {
        if (character.charCodeAt(0) < 32)
          throw new Error("Invalid label character");
        value += character;
      }
    }
    if (!closed) throw new Error("Unterminated label");
    if (Object.hasOwn(labels, name))
      throw new Error("Duplicate label: " + name);
    labels[name] = value;
    skipSpace();
    if (cursor === text.length) break;
    if (text[cursor++] !== ",") throw new Error("Expected label separator");
    skipSpace();
  }
  return labels;
}
export function parseSample(line: string): Sample {
  const text = line.trim();
  let cursor = 0;
  while (nameCharacter(text[cursor])) cursor++;
  const name = text.slice(0, cursor);
  if (!/^[a-zA-Z_:][a-zA-Z0-9_:]*$/.test(name))
    throw new Error("Invalid sample line");
  let labels: Record<string, string> = {};
  if (text[cursor] === "{") {
    const start = ++cursor;
    let quoted = false;
    let escaped = false;
    while (cursor < text.length) {
      const character = text[cursor];
      if (escaped) escaped = false;
      else if (quoted && character === "\\") escaped = true;
      else if (character === '"') quoted = !quoted;
      else if (!quoted && character === "}") break;
      cursor++;
    }
    if (cursor === text.length) throw new Error("Unterminated sample labels");
    labels = parseLabels(text.slice(start, cursor++));
  }
  if (!whitespace(text[cursor])) throw new Error("Invalid sample line");
  while (whitespace(text[cursor])) cursor++;
  const start = cursor;
  while (cursor < text.length && !whitespace(text[cursor])) cursor++;
  const raw = text.slice(start, cursor);
  if (
    !/^(?:[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|NaN|[+-]?Inf)$/.test(
      raw,
    )
  )
    throw new Error("Invalid metric value: " + raw);
  while (whitespace(text[cursor])) cursor++;
  const timestamp = text.slice(cursor);
  if (timestamp && !/^-?\d+$/.test(timestamp))
    throw new Error("Invalid sample timestamp");
  const value =
    raw === "NaN"
      ? NaN
      : raw === "Inf" || raw === "+Inf"
        ? Infinity
        : raw === "-Inf"
          ? -Infinity
          : Number(raw);
  return {
    name,
    labels,
    value,
    ...(timestamp ? { timestamp: Number(timestamp) } : {}),
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
    const kind = line.startsWith("# HELP ")
      ? "HELP"
      : line.startsWith("# TYPE ")
        ? "TYPE"
        : undefined;
    if (kind) {
      const start = 7;
      let cursor = start;
      while (nameCharacter(line[cursor])) cursor++;
      const name = line.slice(start, cursor);
      if (!/^[a-zA-Z_:][a-zA-Z0-9_:]*$/.test(name) || !whitespace(line[cursor]))
        throw new Error("Invalid metric directive");
      while (whitespace(line[cursor])) cursor++;
      const value = line.slice(cursor);
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
