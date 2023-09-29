import { BaseAnimation } from "./BaseAnimation.js";
import { write } from "../Logger.js";

export class SpinnerAnimation extends BaseAnimation {
  constructor() {
    super(write, ["-", "\\", "|", "/"], 200);
  }
}
