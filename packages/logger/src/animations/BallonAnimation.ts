import { BaseAnimation } from "./BaseAnimation";
import { write } from "../Logger";

export class BallonAnimation extends BaseAnimation {
  constructor() {
    super(
      write,
      ['.', 'o', 'O', '@', '*', ' '],
      200
    );
  }
}
