import {
  Counter,
  Gauge,
  Histogram,
  Summary,
  CounterConfiguration,
  GaugeConfiguration,
  HistogramConfiguration,
  SummaryConfiguration,
  Metric,
} from "prom-client";
export enum TrackOption {
  Calls = "calls",
  Value = "value",
}
export type MetricTypes = Counter | Gauge | Histogram | Summary<any>;
export type MetricConfigurations =
  | CounterConfiguration<any>
  | GaugeConfiguration<any>
  | HistogramConfiguration<any>
  | SummaryConfiguration<any>;
export interface IMetricConfig<T extends MetricConfigurations> {
  name: string;
  help: string;
  labelNames?: string[];
  labelValues?: Record<string, string | number>;
  track?: TrackOption;
  config?: Partial<T>;
}
export interface IMetric<T extends Metric<any>> {
  metric: T;
  labelValues?: Record<string, string | number>;
  track?: TrackOption;
}

function decorator(Kind: any, defaultTrack: TrackOption) {
  return (config: IMetricConfig<any>) => {
    // One metric per decoration, reused by every invocation and instance.
    const metric = new Kind({ ...config, ...config.config });
    const track = config.track ?? defaultTrack;
    const record = (value?: unknown) => {
      const labels = config.labelValues ?? {};
      if (track === TrackOption.Calls) {
        if ("inc" in metric) metric.inc(labels);
        else metric.observe(labels, 1);
      } else {
        if (typeof value !== "number" || !Number.isFinite(value))
          throw new TypeError("Metric value must be finite");
        if ("observe" in metric) metric.observe(labels, value);
        else if ("set" in metric) metric.set(labels, value);
        else metric.inc(labels, value);
      }
    };
    return (
      target: object | Function,
      key?: string | symbol,
      descriptor?: PropertyDescriptor,
    ): void => {
      if (typeof target === "function" && key === undefined) {
        Object.defineProperty(target.prototype, "metricImpl", {
          value: { metric, track },
          configurable: true,
        });
      } else if (descriptor) {
        const original = descriptor.value;
        descriptor.value = function (this: unknown, ...args: unknown[]) {
          if (track === TrackOption.Calls) record();
          const result = original.apply(this, args);
          if (track !== TrackOption.Value) return result;
          if (result && typeof result.then === "function")
            return result.then((value: unknown) => {
              record(value);
              return value;
            });
          record(result);
          return result;
        };
      } else {
        const values = new WeakMap<object, unknown>();
        Object.defineProperty(target, key!, {
          configurable: true,
          enumerable: true,
          get(this: object) {
            if (track === TrackOption.Calls) record();
            return values.get(this);
          },
          set(this: object, value: unknown) {
            if (track === TrackOption.Value) record(value);
            values.set(this, value);
          },
        });
      }
    };
  };
}
export const PromCounter = decorator(Counter, TrackOption.Calls);
export const PromGauge = decorator(Gauge, TrackOption.Value);
export const PromHistogram = decorator(Histogram, TrackOption.Value);
export const PromSummary = decorator(Summary, TrackOption.Value);
