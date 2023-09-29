interface Connection<T> {
  weight: number;
  neuron: Neuron<T>;
}

class Neuron<T> {
  private incomingConnections: Connection<T>[] = [];
  private outgoingConnections: Connection<T>[] = [];
  private bias: number;

  constructor(bias: number) {
      this.bias = bias;
  }

  connect(neuron: Neuron<T>, weight: number): void {
      this.outgoingConnections.push({ weight, neuron });
      neuron.incomingConnections.push({ weight, neuron: this });
  }

  activate(input: T): T {
      let sum = 0;
      for (const connection of this.incomingConnections) {
          sum += connection.weight * connection.neuron.activate(input);
      }
      return (input as any) + sum; // We assume T is a numeric type here, you can adjust as needed.
  }

  propagate(error: T): void {
      for (const connection of this.outgoingConnections) {
          connection.neuron.propagate(error as any); // Adjust as needed based on T.
      }
  }

  toObject(): object {
      return {
          bias: this.bias,
          incomingConnections: this.incomingConnections.map(connection => ({
              weight: connection.weight,
              neuron: connection.neuron.toObject()
          })),
          outgoingConnections: this.outgoingConnections.map(connection => ({
              weight: connection.weight,
              neuron: connection.neuron.toObject()
          }))
      };
  }
}

class Layer<T> {
  private neurons: Neuron<T>[] = [];

  constructor(length: number, createNeuron: (bias: number) => Neuron<T>) {
      for (let i = 0; i < length; i++) {
          this.neurons.push(createNeuron(Math.random()));
      }
  }

  connect(layer: Layer<T>): void {
      for (const neuronA of this.neurons) {
          for (const neuronB of layer.neurons) {
              neuronA.connect(neuronB, Math.random());
          }
      }
  }

  toObject(): object {
      return {
          neurons: this.neurons.map(neuron => neuron.toObject())
      };
  }
}

class Network<T> {
  private inputLayer: Layer<T>;
  private hiddenLayers: Layer<T>[] = [];
  private outputLayer: Layer<T>;

  constructor(
      inputLayerLength: number,
      hiddenLayerLengths: number[],
      outputLayerLength: number,
      createNeuron: (bias: number) => Neuron<T>
  ) {
      this.inputLayer = new Layer(inputLayerLength, createNeuron);
      for (const length of hiddenLayerLengths) {
          this.hiddenLayers.push(new Layer(length, createNeuron));
      }
      this.outputLayer = new Layer(outputLayerLength, createNeuron);
  }

  connect(): void {
      this.inputLayer.connect(this.hiddenLayers[0]);
      for (let i = 0; i < this.hiddenLayers.length - 1; i++) {
          this.hiddenLayers[i].connect(this.hiddenLayers[i + 1]);
      }
      this.hiddenLayers[this.hiddenLayers.length - 1].connect(this.outputLayer);
  }

  activate(input: T[]): T[] {
      const output = this.inputLayer.neurons.map(
          (neuron: Neuron<T>, index: number) => neuron.activate(input[index])
      );
      return this.outputLayer.neurons.map(
          (neuron: Neuron<T>, index: number) => neuron.activate(output[index])
      );
  }

  propagate(error: T[]): void {
      const output = this.inputLayer.neurons.map(
          (neuron: Neuron<T>, index: number) => neuron.activate(error[index])
      );
      this.outputLayer.neurons.map(
          (neuron: Neuron<T>, index: number) => neuron.propagate(error[index])
      );
  }

  train(input: T[], output: T[]): void {
      const outputActivation = this.activate(input);
      const error = output.map((value, index) => value - outputActivation[index]);
      this.propagate(error);
  }

  toObject(): object {
      return {
          inputLayer: this.inputLayer.toObject(),
          hiddenLayers: this.hiddenLayers.map(layer => layer.toObject()),
          outputLayer: this.outputLayer.toObject(),
      };
  }
}

export {
  Neuron,
  Layer,
  Network,
};