import {
  Counter,
  CounterConfiguration,
  Gauge,
  GaugeConfiguration,
  Histogram,
  HistogramConfiguration,
  Metric,
  Summary,
  SummaryConfiguration,
} from 'prom-client';

// Enum for tracking options
export enum TrackOption {
  Calls = 'calls',
  Value = 'value',
}

// Type aliases for metrics and their configurations
export type MetricTypes = Counter | Gauge | Histogram | Summary<any>;
export type MetricConfigurations =
  | CounterConfiguration<any>
  | GaugeConfiguration<any>
  | HistogramConfiguration<any>
  | SummaryConfiguration<any>;

// Interface for metric configuration
export interface IMetricConfig<T extends MetricConfigurations> {
  name: string;
  help: string;
  labelNames?: string[];
  track?: TrackOption;
  config?: T;
}

// Interface for metric implementation
export interface IMetric<T extends Metric<any>> {
  metric: T;
  labelValues?: Record<string, string | number>;
  track?: TrackOption;  // Add this line
}

// Function to track metrics
function trackMetric<T extends Metric<any>>(metricImpl: IMetric<T>, trackOption: TrackOption, value?: any) {
  if (trackOption === TrackOption.Calls && 'inc' in metricImpl.metric) {
    metricImpl.metric.inc(metricImpl.labelValues || {});
  } else if (trackOption === TrackOption.Value && 'set' in metricImpl.metric) {
    metricImpl.metric.set(metricImpl.labelValues || {}, value);
  }
}

// Higher-order function for creating decorators
function createPromMetricDecorator<T extends Metric<any>, C extends MetricConfigurations>(
  MetricImplementation: new (config: IMetricConfig<C>) => IMetric<T>
) {
  return function (config: IMetricConfig<C>) {
    return function (
      target: Object | Function,
      propertyKey?: string | symbol,
      descriptor?: PropertyDescriptor
    ) {
      if (typeof target === 'function') {
        handleClassDecorator(target, MetricImplementation, config);
      } else if (descriptor) {
        handleMethodDecorator(target, descriptor, MetricImplementation, config);
      } else {
        handlePropertyDecorator(target, propertyKey!, MetricImplementation, config);
      }
    };
  };
}

// Function to handle class decorator logic
function handleClassDecorator<C extends MetricConfigurations>(
  target: Function,
  MetricImplementation: new (config: IMetricConfig<C>) => IMetric<any>,
  config: IMetricConfig<C>
) {
  target.prototype['metricImpl'] = new MetricImplementation(config);
}

// Function to handle method decorator logic
function handleMethodDecorator<C extends MetricConfigurations>(
  target: Object,
  descriptor: PropertyDescriptor,
  MetricImplementation: new (config: IMetricConfig<C>) => IMetric<any>,
  config: IMetricConfig<C>
) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const returnValue = originalMethod.apply(this, args);
    const metricImpl = new MetricImplementation(config);
    trackMetric(metricImpl, metricImpl.track!, returnValue);
    return returnValue;
  };
}

// Function to handle property decorator logic
function handlePropertyDecorator<C extends MetricConfigurations>(
  target: Object,
  propertyKey: string | symbol,
  MetricImplementation: new (config: IMetricConfig<C>) => IMetric<any>,
  config: IMetricConfig<C>
) {
  let value: any;
  const getter = function (this: any) {
    const metricImpl = new MetricImplementation(config);
    trackMetric(metricImpl, metricImpl.track!);
    return value;
  };

  const setter = function (this: any, newVal: any) {
    value = newVal;
    const metricImpl = new MetricImplementation(config);
    trackMetric(metricImpl, metricImpl.track!, newVal);
  };

  Object.defineProperty(target, propertyKey, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true,
  });
}

// Concrete implementations for each metric type
class CounterImpl implements IMetric<Counter> {
  metric: Counter;
  track?: TrackOption;
  constructor(config: IMetricConfig<CounterConfiguration<any>>) {
    this.metric = new Counter(config as CounterConfiguration<any>);
    this.track = config.track;
  }
}

class GaugeImpl implements IMetric<Gauge> {
  metric: Gauge;
  track?: TrackOption;
  constructor(config: IMetricConfig<GaugeConfiguration<any>>) {
    this.metric = new Gauge(config as GaugeConfiguration<any>);
    this.track = config.track;
  }
}

class HistogramImpl implements IMetric<Histogram> {
  metric: Histogram;
  track?: TrackOption;
  constructor(config: IMetricConfig<HistogramConfiguration<any>>) {
    this.metric = new Histogram(config as HistogramConfiguration<any>);
    this.track = config.track;
  }
}

class SummaryImpl implements IMetric<Summary<any>> {
  metric: Summary<any>;
  track?: TrackOption;
  constructor(config: IMetricConfig<SummaryConfiguration<any>>) {
    this.metric = new Summary(config as SummaryConfiguration<any>);
    this.track = config.track;
  }
}

// Exporting decorators
export const PromCounter = createPromMetricDecorator(CounterImpl);
export const PromGauge = createPromMetricDecorator(GaugeImpl);
export const PromHistogram = createPromMetricDecorator(HistogramImpl);
export const PromSummary = createPromMetricDecorator(SummaryImpl);
