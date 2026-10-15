export interface ISymbol {
  symbol: string;
  getMultiplier(): number;
  weight: number;
}
export class BaseSymbol implements ISymbol {
  constructor(
    public readonly symbol: string,
    private readonly multiplier: number,
    public readonly weight = 1,
  ) {
    if (
      !Number.isFinite(multiplier) ||
      multiplier < 0 ||
      !Number.isFinite(weight) ||
      weight <= 0
    )
      throw new RangeError("Invalid symbol multiplier or weight");
  }
  getMultiplier(): number {
    return this.multiplier;
  }
}
export class WildSymbol extends BaseSymbol {
  isWild(): boolean {
    return true;
  }
}
export class ScatterSymbol extends BaseSymbol {
  isScatter(): boolean {
    return true;
  }
}
export class Reel<T extends ISymbol> {
  constructor(
    protected readonly symbols: T[],
    protected readonly rows = 3,
    private readonly random: () => number = Math.random,
  ) {
    if (!symbols.length || !Number.isInteger(rows) || rows < 1)
      throw new RangeError("A reel needs symbols and positive rows");
  }
  spin(): T[] {
    const total = this.symbols.reduce((sum, symbol) => sum + symbol.weight, 0);
    return Array.from({ length: this.rows }, () => {
      const value = this.random();
      if (value < 0 || value >= 1 || !Number.isFinite(value))
        throw new RangeError("Random value must be in [0,1)");
      let remaining = value * total;
      return this.symbols.find((symbol) => {
        remaining -= symbol.weight;
        return remaining < 0;
      })!;
    });
  }
}
export class FruitReel extends Reel<BaseSymbol> {
  constructor(random: () => number = Math.random) {
    super(
      [
        new BaseSymbol("🍒", 1, 8),
        new BaseSymbol("🍋", 1, 7),
        new BaseSymbol("🍊", 1.5, 5),
        new BaseSymbol("🍉", 1.5, 4),
        new BaseSymbol("🍎", 2, 3),
        new WildSymbol("🍀", 2, 2),
        new ScatterSymbol("🎲", 7, 1),
      ],
      3,
      random,
    );
  }
}
export class SlotMachine<T extends ISymbol> {
  constructor(
    protected readonly reels: Reel<T>[],
    protected credit = 100,
  ) {
    if (!Number.isFinite(credit) || credit < 0 || !reels.length)
      throw new RangeError("Invalid initial state");
  }
  protected betAndSpin(bet: number): T[][] {
    if (!Number.isFinite(bet) || bet < 0 || bet > this.credit)
      throw new RangeError("Invalid wager or insufficient credits");
    const grid = this.reels.map((reel) => reel.spin());
    this.credit = Math.round((this.credit - bet) * 100) / 100;
    return grid;
  }
  adjustCredit(amount: number): void {
    if (!Number.isFinite(amount) || this.credit + amount < 0)
      throw new RangeError("Invalid credit adjustment");
    this.credit = Math.round((this.credit + amount) * 100) / 100;
  }
  getCredit(): number {
    return this.credit;
  }
}
export class FruitSlotMachine extends SlotMachine<BaseSymbol> {
  private freeSpins = 0;
  private freeSpinBet = 0;
  constructor(initialCredit = 100, random: () => number = Math.random) {
    super(
      Array.from({ length: 3 }, () => new FruitReel(random)),
      initialCredit,
    );
  }
  getFreeSpins(): number {
    return this.freeSpins;
  }
  betAndSpin(bet: number): BaseSymbol[][] {
    if (!Number.isFinite(bet) || bet <= 0)
      throw new RangeError("Wager must be positive");
    const free = this.freeSpins > 0;
    const effectiveBet = free ? this.freeSpinBet : bet;
    const grid = super.betAndSpin(free ? 0 : bet);
    if (free) this.freeSpins--;
    const win = this.calculateWin(grid, effectiveBet);
    this.adjustCredit(win);
    if (
      grid.flat().filter((symbol) => symbol instanceof ScatterSymbol).length >=
      3
    ) {
      this.freeSpins += 10;
      this.freeSpinBet = effectiveBet;
    }
    if (this.freeSpins === 0) this.freeSpinBet = 0;
    return grid;
  }
  calculateWin(grid: BaseSymbol[][], bet: number): number {
    if (grid.length !== 3 || grid.some((column) => column.length !== 3))
      throw new RangeError("Expected three reels with three rows");
    const lines = [0, 1, 2].map((row) => grid.map((column) => column[row]));
    lines.push(
      [grid[0][0], grid[1][1], grid[2][2]],
      [grid[0][2], grid[1][1], grid[2][0]],
    );
    const win = lines.reduce((sum, line) => {
      if (line.some((symbol) => symbol instanceof ScatterSymbol)) return sum;
      const reference =
        line.find((symbol) => !(symbol instanceof WildSymbol)) ?? line[0];
      return line.every(
        (symbol) =>
          symbol instanceof WildSymbol || symbol.symbol === reference.symbol,
      )
        ? sum + bet * reference.getMultiplier()
        : sum;
    }, 0);
    return Math.round(win * 100) / 100;
  }
}
