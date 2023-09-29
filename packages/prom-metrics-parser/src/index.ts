type MetricType = "counter" | "gauge" | "histogram" | "summary" | "untyped";
type MetricValue = string | number;

interface Metric {
  name: string;
  type: MetricType;
  help: string;
  samples: Sample[];
}

interface Sample {
  name: string;
  labels: { [key: string]: string };
  value: MetricValue;
}

const isValidMetricType = (type: string): type is MetricType => {
  return ["counter", "gauge", "histogram", "summary", "untyped"].includes(type);
};

const parseLine = (line: string): string[] => {
  return line.trim().split(/\s+/);
};

const parseTypeAndHelp = (line: string, currentMetric: Metric): void => {
  const [prefix, name, ...rest] = parseLine(line);

  if (prefix === "# TYPE") {
    const type = rest.join(" ");

    if (!isValidMetricType(type)) {
      throw new Error(`Invalid metric type: ${type}`);
    }

    currentMetric.name = name;
    currentMetric.type = type;
  }

  if (prefix === "# HELP") {
    const help = rest.join(" ");
    currentMetric.help = help;
  }
};

const parseLabels = (labelsStr: string): { [key: string]: string } => {
  const labels: { [key: string]: string } = {};
  const labelPairs = labelsStr.slice(1, -1).split(",");

  for (const pair of labelPairs) {
    const [key, val] = pair.split("=");
    labels[key] = val.slice(1, -1);
  }

  return labels;
};

const parseSample = (line: string): Sample => {
  const [sampleStr, valueStr] = parseLine(line);
  const value = parseFloat(valueStr);

  if (isNaN(value)) {
    throw new Error(`Invalid metric value: ${valueStr}`);
  }

  const match = /^([a-zA-Z_:][a-zA-Z0-9_:]*)(\{.*\})?$/.exec(sampleStr);

  if (!match) {
    throw new Error("Invalid sample line");
  }

  const [, sampleName, labelsStr] = match;
  const labels = labelsStr ? parseLabels(labelsStr) : {};

  return { name: sampleName, labels, value };
};

const parsePrometheusMetrics = (metricsText: string): Metric[] => {
  const lines = metricsText.split("\n");
  const metrics: Metric[] = [];
  let currentMetric: Metric | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine === "" || trimmedLine.startsWith("#")) {
      if (
        currentMetric &&
        (trimmedLine.startsWith("# TYPE") || trimmedLine.startsWith("# HELP"))
      ) {
        parseTypeAndHelp(trimmedLine, currentMetric);
      }
      continue;
    }

    if (!currentMetric) {
      currentMetric = {
        name: "",
        type: "untyped",
        help: "",
        samples: [],
      };
      metrics.push(currentMetric);
    }

    const sample = parseSample(trimmedLine);
    currentMetric.samples.push(sample);
  }

  return metrics;
};

// Test the function
const metricsText = `
# HELP http_requests_total The total number of HTTP requests.
# TYPE http_requests_total counter
http_requests_total{method="post",code="200"} 1027
http_requests_total{method="post",code="400"} 3

# HELP http_duration_seconds HTTP request duration in seconds.
# TYPE http_duration_seconds histogram
http_duration_seconds_bucket{le="0.05"} 24054
http_duration_seconds_bucket{le="0.1"} 33444
http_duration_seconds_bucket{le="0.2"} 100392
http_duration_seconds_count 144320
http_duration_seconds_sum 53423
`;

const parsedMetrics = parsePrometheusMetrics(metricsText);
console.log(JSON.stringify(parsedMetrics, null, 2));
