export type Rule = {
  symbol: SymbolType;
  transform: Array<SymbolType>;
  probability: number;
};

export enum SymbolType {
  North = "N",
  East = "E",
  South = "S",
  West = "W",
  Forward = "F",
  Checkpoint = "C",
  Jump = "J",
}

export class LSystem {
  private axiom: string;
  private rules: Array<Rule>;

  constructor(
    axiom: string,
    rules: Rule[],
    private random: () => number = Math.random,
  ) {
    this.axiom = axiom;
    this.rules = rules;
  }

  public generate(iterations: number): string {
    if (!Number.isInteger(iterations) || iterations < 0)
      throw new RangeError("iterations must be a non-negative integer");
    let result = this.axiom;
    for (let i = 0; i < iterations; i++) {
      result = this.applyRules(result);
    }
    return result;
  }

  private applyRules(str: string): string {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      const rules = this.rules.filter((r) => r.symbol === str[i]);
      if (rules.length > 0) {
        const rule = this.getRandomRule(rules);
        result += rule.transform.join("");
      } else {
        result += str[i];
      }
    }
    return result;
  }

  private getRandomRule(rules: Rule[]): Rule {
    const total = rules.reduce((sum, rule) => sum + rule.probability, 0);
    if (
      !Number.isFinite(total) ||
      total <= 0 ||
      rules.some((rule) => rule.probability < 0)
    )
      throw new RangeError(
        "Rule weights must be non-negative with a positive total",
      );
    const random = this.random() * total;
    let sum = 0;
    for (let i = 0; i < rules.length; i++) {
      sum += rules[i].probability;
      if (random < sum) {
        return rules[i];
      }
    }
    return rules[rules.length - 1];
  }
}
