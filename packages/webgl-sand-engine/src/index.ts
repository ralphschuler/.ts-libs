// Basic Types
type Vector2D = [number, number];
export type PixelColor = [number, number, number, number];

// Event Interface
interface IEvent<T> {
  subscribe(observer: (payload: T) => void): void;
  unsubscribe(observer: (payload: T) => void): void;
  notify(payload: T): void;
}

// Specific Event Interfaces
interface IStepEvent<GridType> extends IEvent<GridType> {}
interface IAddEvent<ItemType> extends IEvent<ItemType> {}
interface IRemoveEvent extends IEvent<string> {}

// Config Type Maps
type PixelType = "Sand" | "Water";

type PixelConfigMap =
  | { type: "Sand"; metadata: { density: number } }
  | { type: "Water"; metadata: { density: number; temperature?: number } };

type EntityConfigMap = {
  tree: { health: number; age: number };
  plant: { health: number };
};

// Rule Interface with Generics
export interface IRule<ItemType, GridType> {
  apply(item: ItemType, grid: GridType): boolean;
}

// Base Item Interface
interface IBaseItem<IDType, TypeType, ConfigType> {
  id: IDType;
  type: TypeType;
  config: ConfigType;
  position: Vector2D;
  size: Vector2D;
}

// Pixel Interface
type IPixel = IBaseItem<string, PixelType, PixelConfigMap>;

// Entity Interface
type EntityType = keyof EntityConfigMap;
type IEntity<IDType, TypeType extends EntityType> = IBaseItem<
  IDType,
  TypeType,
  EntityConfigMap[TypeType]
> & {
  pixels: Array<IPixel>;
};

// Chunk Interface with Neighbor Provider
interface IChunk {
  id: string;
  position: Vector2D;
  size: Vector2D;
  pixels: Array<IPixel>;
  entities: Array<IEntity<string, EntityType>>;
  neighborProvider: INeighborProvider<IChunk>; // Added neighborProvider
}

// Grid Interface with Neighbor Provider
interface IGrid {
  size: Vector2D;
  chunks: Array<IChunk>;
  neighborProvider: INeighborProvider<IGrid>; // Added neighborProvider
}

// Manipulator Interface with Generics
interface IManipulator<ItemType> {
  add(position: Vector2D, item: ItemType): void;
  remove(id: string): void;
  move(id: string, position: Vector2D): void;
  replace(id: string, item: ItemType): void;
}

// Simulation Interface with Generics and Events
export interface ISimulation {
  grid: IGrid;
  manipulator: IManipulator<IPixel | IEntity<string, EntityType>>;
  step(): void;
  onStep: IStepEvent<IGrid>;
  onAdd: IAddEvent<IPixel | IEntity<string, EntityType>>;
  onRemove: IRemoveEvent;
}

// Renderer Interface
export interface IRenderer {
  initWebGL(canvas: HTMLCanvasElement): void;
  draw(grid: IGrid): void;
}

// Generic Storage Backend Interface
interface IStorageBackend<StateType> {
  save(key: string, state: StateType): void;
  load(key: string): StateType | null;
}

// State Storage Interface with Generics
interface IStateStorage<
  StateType,
  BackendType extends IStorageBackend<StateType>,
> {
  serialize(item: StateType): string;
  deserialize(data: string): StateType;
  saveState(key: string, state: StateType): void;
  loadState(key: string): StateType | null;
  backend: BackendType;
}

// Specific State Storage Implementation for Simulation
export interface ISimulationStateStorage
  extends IStateStorage<IGrid, IStorageBackend<IGrid>> {}

// Neighbor Provider Interface
interface INeighborProvider<ItemType> {
  getNeighbors(position: Vector2D, range: number): Array<ItemType>;
}

// Generic Wrapper Class for Neighbor Provider
export class NeighborProvider<ItemType extends { position: Vector2D }>
  implements INeighborProvider<ItemType>
{
  private items: Array<ItemType>;

  constructor(items: Array<ItemType>) {
    this.items = items;
  }

  getNeighbors(position: Vector2D, range: number): Array<ItemType> {
    if (!Number.isFinite(range) || range < 0)
      throw new RangeError("range must be non-negative");
    return this.items.filter(
      (item) =>
        Math.hypot(
          item.position[0] - position[0],
          item.position[1] - position[1],
        ) <= range,
    );
  }
}

/** Deterministic CPU reference: 0 is empty, 1 is sand. GPU rendering is separate. */
export class SandSimulation {
  private cells: Uint8Array;
  constructor(
    public readonly width: number,
    public readonly height: number,
    initial?: Uint8Array,
  ) {
    if (
      !Number.isInteger(width) ||
      !Number.isInteger(height) ||
      width < 1 ||
      height < 1 ||
      width * height > 1_000_000
    )
      throw new RangeError("Invalid grid dimensions");
    if (
      initial &&
      (initial.length !== width * height ||
        initial.some((cell) => cell !== 0 && cell !== 1))
    )
      throw new RangeError("Invalid grid cells");
    this.cells = initial ? initial.slice() : new Uint8Array(width * height);
  }
  snapshot(): Uint8Array {
    return this.cells.slice();
  }
  step(): Uint8Array {
    const previous = this.cells;
    const next = previous.slice();
    for (let y = this.height - 2; y >= 0; y--) {
      for (let x = 0; x < this.width; x++) {
        const index = y * this.width + x;
        if (previous[index] !== 1) continue;
        for (const dx of [0, -1, 1]) {
          const destinationX = x + dx;
          if (destinationX < 0 || destinationX >= this.width) continue;
          const destination = (y + 1) * this.width + destinationX;
          if (previous[destination] === 0 && next[destination] === 0) {
            next[index] = 0;
            next[destination] = 1;
            break;
          }
        }
      }
    }
    this.cells = next;
    return this.snapshot();
  }
}
