import readline from "readline";

interface ISymbol {
  symbol: string;
  getMultiplier(): number;
}

// Defining concrete classes for different types of symbols
class BaseSymbol implements ISymbol {
  constructor(
    public readonly symbol: string,
    private readonly multiplier: number,
  ) {}

  getMultiplier(): number {
    return this.multiplier;
  }
}

class WildSymbol extends BaseSymbol {
  constructor(symbol: string, multiplier: number) {
    super(symbol, multiplier);
  }

  isWild(): boolean {
    return true;
  }
}

class ScatterSymbol extends BaseSymbol {
  constructor(symbol: string, multiplier: number) {
    super(symbol, multiplier);
  }

  isScatter(): boolean {
    return true;
  }
}

abstract class Reel<T extends ISymbol> {
  protected symbols: T[];
  protected rows: number;

  constructor(symbols: T[], rows: number = 3) {
    this.symbols = symbols;
    this.rows = rows;
  }

  spin(): T[][] {
    const spunReels: T[][] = [];

    for (let i = 0; i < this.rows; i++) {
      spunReels.push(this.getRandomSymbol());
    }

    return spunReels;
  }

  private getRandomSymbol(): T {
    // Calculate the total weight
    let totalWeight = 0;
    for (const symbol of this.symbols) {
      totalWeight += 1 / symbol.getMultiplier();
    }

    // Generate a random value within this total weight
    let randomWeight = Math.random() * totalWeight;

    // Find the symbol corresponding to the randomWeight
    for (const symbol of this.symbols) {
      randomWeight -= 1 / symbol.getMultiplier();
      if (randomWeight <= 0) {
        return symbol;
      }
    }

    // Fallback in case of rounding errors
    return this.symbols[this.symbols.length - 1];
  }
}

class FruitReel extends Reel<BaseSymbol> {
  constructor() {
    super([
      new BaseSymbol("🍒", 0.5),
      new BaseSymbol("🍋", 1),
      new BaseSymbol("🍊", 2),
      new BaseSymbol("🍉", 3),
      new WildSymbol("⭐", 5),
      new ScatterSymbol("🎲", 5),
    ]);
  }
}

class SlotMachine<T extends ISymbol> {
  protected reels: Reel<T>[];
  protected credit: number;

  constructor(reels: Reel<T>[], initialCredit: number = 100) {
    this.reels = reels;
    this.credit = initialCredit;
  }

  betAndSpin(bet: number): T[][] {
    if (bet > this.credit) {
      console.log("Insufficient credit to place bet.");
      return [];
    }

    this.credit -= bet;
    const spunReels = this.reels.map((reel) => reel.spin());

    return spunReels;
  }

  adjustCredit(amount: number): void {
    this.credit += amount;
    this.credit = parseFloat(this.credit.toFixed(2));
  }

  getCredit(): number {
    return parseFloat(this.credit.toFixed(2));
  }
}

class FruitSlotMachine extends SlotMachine<BaseSymbol> {
  private freeSpins: number = 0;
  private freeSpinBet: number = 0;

  constructor(initialCredit: number = 100) {
    const fruitReels = [new FruitReel(), new FruitReel(), new FruitReel()];
    super(fruitReels, initialCredit);
    this.displayInitial();
  }

  betAndSpin(bet: number): void {
    let spunReels: BaseSymbol[][];
    bet = parseFloat(bet.toFixed(2));

    if (this.freeSpins > 0) {
      console.log(`Free spin! Remaining: ${this.freeSpins}`);
      spunReels = super.betAndSpin(0); // No credit is deducted
      this.freeSpins--;

      if (this.freeSpins === 0) {
        this.freeSpinBet = 0; // Reset free spin bet when free spins are done
      }
    } else {
      spunReels = super.betAndSpin(bet);
      this.checkForSpecialSymbols(spunReels, bet);
    }

    if (spunReels.length > 0) {
      const currentBet = this.freeSpins > 0 ? this.freeSpinBet : bet;
      const win = this.calculateWin(spunReels, currentBet);

      this.display(spunReels, win, this.getCredit());

      if (win > 0) {
        this.adjustCredit(win);
        console.log(
          `You won ${win} credits! Total credit: ${this.getCredit()}`,
        );
      } else {
        console.log(`No win. Remaining credit: ${this.getCredit()}`);
      }
    }
  }

  display(spunReels: BaseSymbol[][], win: number, credit: number): void {
    // Implement the logic to display the slot machine's ASCII art
    // Replace #1#, #2#, etc. with the symbols or credit and win values
    const slotMachineArt = `
    ┌───────────────────┐
    │ %_____win_____% $ │
┌──────────────────────────┐
│ 🍒🍒🍒 777 Fruits 🍒🍒🍒 │
├──────────────────────────┤
│ >%1%< │ >%4%< │ >%7%< │
│────────┼────────┼────────│
│ >%2%< │ >%5%< │ >%8%< │
│────────┼────────┼────────│
│ >%3%< │ >%6%< │ >%9%< │
├──────────────────────────┤
│ Credits: %___credit__% $ │
└──────────────────────────┘
    `;
    const winTemplate = "%_____win_____%";
    const creditTemplate = "%___credit__%";
    const symbolsTemplate = [
      "%1%",
      "%2%",
      "%3%",
      "%4%",
      "%5%",
      "%6%",
      "%7%",
      "%8%",
      "%9%",
    ];

    let art = slotMachineArt
      .replace(
        winTemplate,
        " ".repeat(winTemplate.length - win.toString().length) + win,
      )
      .replace(
        creditTemplate,
        " ".repeat(creditTemplate.length - credit.toString().length) + credit,
      )
      .replace(symbolsTemplate[0], ` ${spunReels[0][0].symbol} `)
      .replace(symbolsTemplate[1], ` ${spunReels[1][0].symbol} `)
      .replace(symbolsTemplate[2], ` ${spunReels[2][0].symbol} `)
      .replace(symbolsTemplate[3], ` ${spunReels[0][1].symbol} `)
      .replace(symbolsTemplate[4], ` ${spunReels[1][1].symbol} `)
      .replace(symbolsTemplate[5], ` ${spunReels[2][1].symbol} `)
      .replace(symbolsTemplate[6], ` ${spunReels[0][2].symbol} `)
      .replace(symbolsTemplate[7], ` ${spunReels[1][2].symbol} `)
      .replace(symbolsTemplate[8], ` ${spunReels[2][2].symbol} `);

    console.log("\n".repeat(100)); // Clear the console
    console.log(art);
  }

  private calculateWin(spunReels: BaseSymbol[][], bet: number): number {
    let winAmount = 0;

    winAmount += this.calculateHorizontalWin(spunReels, bet);
    winAmount += this.calculateDiagonalWin(spunReels, bet);
    winAmount += this.calculateReverseDiagonalWin(spunReels, bet);

    return parseFloat(winAmount.toFixed(2));
  }

  private calculateHorizontalWin(
    spunReels: BaseSymbol[][],
    bet: number,
  ): number {
    let win = 0;

    for (const spunReel of spunReels) {
      const symbols = spunReel.filter(
        (reel) => reel instanceof BaseSymbol, // Only consider BaseSymbols
      );

      if (symbols.length > 0) {
        const symbol = symbols[0]; // Take the first BaseSymbol in the row
        if (
          symbols.every(
            (reel) =>
              reel.symbol === symbol.symbol || reel instanceof WildSymbol,
          )
        ) {
          win += bet * symbol.getMultiplier();
        }
      }
    }

    return win;
  }

  private displayInitial(): void {
    // Create a default set of reels for the initial display
    const defaultReels = [
      [
        new BaseSymbol("🍒", 2),
        new BaseSymbol("🍒", 2),
        new BaseSymbol("🍒", 2),
      ],
      [
        new BaseSymbol("🍋", 2),
        new BaseSymbol("🍋", 2),
        new BaseSymbol("🍋", 2),
      ],
      [
        new BaseSymbol("🍊", 5),
        new BaseSymbol("🍊", 5),
        new BaseSymbol("🍊", 5),
      ],
    ];

    // Call the display function with the default reels
    this.display(defaultReels, 0, this.getCredit());
  }

  private calculateDiagonalWin(spunReels: BaseSymbol[][], bet: number): number {
    let win = 0;

    const diagonalSymbols = [spunReels[0][0], spunReels[1][1], spunReels[2][2]];
    const symbols = diagonalSymbols.filter(
      (reel) => reel instanceof BaseSymbol, // Only consider BaseSymbols
    );

    if (symbols.length > 0) {
      const symbol = symbols[0]; // Take the first BaseSymbol in the diagonal
      if (
        symbols.every(
          (reel) => reel.symbol === symbol.symbol || reel instanceof WildSymbol,
        )
      ) {
        win += bet * symbol.getMultiplier();
      }
    }

    return win;
  }

  private calculateReverseDiagonalWin(
    spunReels: BaseSymbol[][],
    bet: number,
  ): number {
    let win = 0;

    const reverseDiagonalSymbols = [
      spunReels[2][0],
      spunReels[1][1],
      spunReels[0][2],
    ];
    const symbols = reverseDiagonalSymbols.filter(
      (reel) => reel instanceof BaseSymbol, // Only consider BaseSymbols
    );

    if (symbols.length > 0) {
      const symbol = symbols[0]; // Take the first BaseSymbol in the reverse diagonal
      if (
        symbols.every(
          (reel) => reel.symbol === symbol.symbol || reel instanceof WildSymbol,
        )
      ) {
        win += bet * symbol.getMultiplier();
      }
    }

    return win;
  }

  private checkForSpecialSymbols(spunReels: BaseSymbol[][], bet: number): void {
    const scatterCount = spunReels
      .flat()
      .filter((reel) => reel instanceof ScatterSymbol).length;
    if (scatterCount >= 3) {
      this.freeSpins += 10; // Award 3 free spins
      this.freeSpinBet = bet; // Record the bet amount for free spins
      console.log(
        `Scatter hit! You've been awarded ${this.freeSpins} free spins.`,
      );
    }
  }

  // Additional methods specific to the fruit slot machine can be added here
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const fruitSlotMachine = new FruitSlotMachine();
let bet = 0;
function promptUser() {
  rl.question('Enter your bet (or type "exit" to quit): ', (input) => {
    if (input.toLowerCase() === "exit") {
      console.log("Thank you for playing!");
      rl.close();
      return;
    }

    if (input !== "") {
      bet = parseFloat(input);
    }
    if (isNaN(bet)) {
      console.log("Please enter a valid number!");
      promptUser();
      return;
    } else {
      bet = parseFloat(bet.toFixed(2));
    }
    fruitSlotMachine.betAndSpin(bet);
    promptUser();
    return;
  });
}

promptUser();
