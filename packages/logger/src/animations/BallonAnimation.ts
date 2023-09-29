import { BaseAnimation } from "./BaseAnimation.js";
import { write } from "../Logger.js";

export class BallonAnimation extends BaseAnimation {
  constructor() {
    super(write, [".", "o", "O", "@", "*", " "], 200);
  }
}
