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

  constructor(axiom: string, rules: Rule[]) {
    this.axiom = axiom;
    this.rules = rules;
  }

  public generate(iterations: number): string {
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
        result += rule.transform;
      } else {
        result += str[i];
      }
    }
    return result;
  }

  private getRandomRule(rules: Rule[]): Rule {
    const random = Math.random();
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
