import { BaseAnimation } from "./BaseAnimation.js";
import { write } from "../Logger.js";

export class HorizontalBarAnimation extends BaseAnimation {
  constructor() {
    super(
      write,
      ["▏", "▎", "▍", "▌", "▋", "▊", "▉", "▉", "▊", "▋", "▌", "▍", "▎"],
      100,
    );
  }
}
