import { BaseAnimation } from "./BaseAnimation.js";
import { write } from "../Logger.js";

export class ClockAnimation extends BaseAnimation {
  constructor() {
    super(
      write,
      ["🕛", "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚"],
      300,
    );
  }
}
