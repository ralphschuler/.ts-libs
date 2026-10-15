export interface Connection<T extends number = number> {
  weight: number;
  neuron: Neuron<T>;
}
let nextNeuronId = 0;
export class Neuron<T extends number = number> {
  readonly id = nextNeuronId++;
  readonly incomingConnections: Connection<T>[] = [];
  readonly outgoingConnections: Connection<T>[] = [];
  value = 0;
  delta = 0;
  constructor(public bias: number) {
    if (!Number.isFinite(bias)) throw new RangeError("Bias must be finite");
  }
  connect(neuron: Neuron<T>, weight: number): void {
    if (!Number.isFinite(weight)) throw new RangeError("Weight must be finite");
    const reaches = (
      start: Neuron<T>,
      seen = new Set<Neuron<T>>(),
    ): boolean => {
      if (start === this) return true;
      if (seen.has(start)) return false;
      seen.add(start);
      return start.outgoingConnections.some((edge) =>
        reaches(edge.neuron, seen),
      );
    };
    if (reaches(neuron)) throw new Error("Cyclic neuron connection");
    this.outgoingConnections.push({ weight, neuron });
    neuron.incomingConnections.push({ weight, neuron: this });
  }
  activate(input: T): T {
    const sum = this.incomingConnections.length
      ? this.incomingConnections.reduce(
          (total, edge) => total + edge.weight * edge.neuron.value,
          this.bias,
        )
      : Number(input) + this.bias;
    this.value = 1 / (1 + Math.exp(-sum));
    return this.value as T;
  }
  propagate(error: T): void {
    this.delta = Number(error) * this.value * (1 - this.value);
  }
  toObject(): object {
    return {
      id: this.id,
      bias: this.bias,
      outgoingConnections: this.outgoingConnections.map((edge) => ({
        neuronId: edge.neuron.id,
        weight: edge.weight,
      })),
    };
  }
}
export class Layer<T extends number = number> {
  readonly neurons: Neuron<T>[];
  constructor(
    length: number,
    createNeuron: (bias: number) => Neuron<T>,
    private readonly random: () => number = Math.random,
  ) {
    if (!Number.isInteger(length) || length < 1)
      throw new RangeError("Layer length must be positive");
    this.neurons = Array.from({ length }, () => createNeuron(random() - 0.5));
  }
  connect(layer: Layer<T>): void {
    for (const from of this.neurons)
      for (const to of layer.neurons) from.connect(to, this.random() - 0.5);
  }
  toObject(): object {
    return { neurons: this.neurons.map((neuron) => neuron.toObject()) };
  }
}
export class Network<T extends number = number> {
  private readonly layers: Layer<T>[];
  private connected = false;
  constructor(
    inputLength: number,
    hiddenLengths: number[],
    outputLength: number,
    createNeuron: (bias: number) => Neuron<T> = (bias) => new Neuron<T>(bias),
    random: () => number = Math.random,
  ) {
    this.layers = [inputLength, ...hiddenLengths, outputLength].map(
      (length) => new Layer(length, createNeuron, random),
    );
  }
  connect(): void {
    if (this.connected) return;
    for (let i = 1; i < this.layers.length; i++)
      this.layers[i - 1].connect(this.layers[i]);
    this.connected = true;
  }
  activate(input: T[]): T[] {
    if (!this.connected) this.connect();
    if (
      input.length !== this.layers[0].neurons.length ||
      input.some((value) => !Number.isFinite(value))
    )
      throw new RangeError("Invalid input shape or value");
    this.layers[0].neurons.forEach((neuron, index) => {
      neuron.value = input[index];
    });
    for (const layer of this.layers.slice(1))
      for (const neuron of layer.neurons) neuron.activate(0 as T);
    return this.layers[this.layers.length - 1].neurons.map(
      (neuron) => neuron.value as T,
    );
  }
  propagate(error: T[], learningRate = 0.1): void {
    if (
      !Number.isFinite(learningRate) ||
      learningRate <= 0 ||
      error.some((value) => !Number.isFinite(value))
    )
      throw new RangeError("Invalid training values");
    const output = this.layers[this.layers.length - 1];
    if (error.length !== output.neurons.length)
      throw new RangeError("Invalid error shape");
    output.neurons.forEach((neuron, index) => neuron.propagate(error[index]));
    for (let i = this.layers.length - 2; i > 0; i--) {
      for (const neuron of this.layers[i].neurons) {
        const total = neuron.outgoingConnections.reduce((sum, edge) => {
          const incoming = edge.neuron.incomingConnections.find(
            (candidate) => candidate.neuron === neuron,
          )!;
          return sum + incoming.weight * edge.neuron.delta;
        }, 0);
        neuron.propagate(total as T);
      }
    }
    for (const layer of this.layers.slice(1))
      for (const neuron of layer.neurons) {
        neuron.bias += learningRate * neuron.delta;
        for (const edge of neuron.incomingConnections) {
          edge.weight += learningRate * neuron.delta * edge.neuron.value;
          const outgoing = edge.neuron.outgoingConnections.find(
            (connection) => connection.neuron === neuron,
          );
          if (outgoing) outgoing.weight = edge.weight;
        }
      }
  }
  train(input: T[], target: T[], learningRate = 0.1): void {
    if (
      !Number.isFinite(learningRate) ||
      learningRate <= 0 ||
      target.some((value) => !Number.isFinite(value))
    )
      throw new RangeError("Invalid training values");
    const actual = this.activate(input);
    if (target.length !== actual.length)
      throw new RangeError("Invalid target shape");
    this.propagate(
      target.map((value, index) => (value - actual[index]) as T),
      learningRate,
    );
  }
  toObject(): object {
    return { layers: this.layers.map((layer) => layer.toObject()) };
  }
}
