import { BaseAnimation } from "./BaseAnimation.js";
import { write } from "../Logger.js";

export class DotsAnimation extends BaseAnimation {
  constructor() {
    super(write, [".  ", ".. ", "..."], 200);
  }
}
