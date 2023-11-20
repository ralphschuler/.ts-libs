import { BaseAnimation } from "./BaseAnimation.js";
import { write } from "../Logger.js";

export class VerticalBarAnimation extends BaseAnimation {
  constructor() {
    super(
      write,
      ["▁", "▃", "▄", "▅", "▆", "▇", "█", "▇", "▆", "▅", "▄", "▃"],
      100,
    );
  }
}
