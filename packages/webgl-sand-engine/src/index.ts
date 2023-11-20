// Basic Types
type Vector2D = [number, number];
type PixelColor = [number, number, number, number];

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
interface IRule<ItemType, GridType> {
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
interface ISimulation {
  grid: IGrid;
  manipulator: IManipulator<IPixel | IEntity<string, EntityType>>;
  step(): void;
  onStep: IStepEvent<IGrid>;
  onAdd: IAddEvent<IPixel | IEntity<string, EntityType>>;
  onRemove: IRemoveEvent;
}

// Renderer Interface
interface IRenderer {
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
interface ISimulationStateStorage
  extends IStateStorage<IGrid, IStorageBackend<IGrid>> {}

// Neighbor Provider Interface
interface INeighborProvider<ItemType> {
  getNeighbors(position: Vector2D, range: number): Array<ItemType>;
}

// Generic Wrapper Class for Neighbor Provider
class NeighborProvider<ItemType> implements INeighborProvider<ItemType> {
  private items: Array<ItemType>;

  constructor(items: Array<ItemType>) {
    this.items = items;
  }

  getNeighbors(position: Vector2D, range: number): Array<ItemType> {
    // Implement your logic to find neighbors within the given range
    // For now, returning an empty array
    return [];
  }
}
