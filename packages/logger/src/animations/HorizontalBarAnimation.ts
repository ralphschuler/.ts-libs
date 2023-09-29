import { BaseAnimation } from "./BaseAnimation";
import { write } from "../Logger";

export class HorizontalBarAnimation extends BaseAnimation {
  constructor(...args: any[]) {
    super(
      write,
      ["▏", "▎", "▍", "▌", "▋", "▊", "▉", "▉", "▊", "▋", "▌", "▍", "▎"],
      100,
      ...args
    );
  }
}
