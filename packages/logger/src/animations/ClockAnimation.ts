import { BaseAnimation } from "./BaseAnimation";
import { write } from "../Logger";

export class ClockAnimation extends BaseAnimation {
  constructor(...args: any[]) {
    super(
      write,
      [
        "🕛",
        "🕐",
        "🕑",
        "🕒",
        "🕓",
        "🕔",
        "🕕",
        "🕖",
        "🕗",
        "🕘",
        "🕙",
        "🕚",
      ],
      300,
      ...args
    );
  }
}
