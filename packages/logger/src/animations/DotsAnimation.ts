import { BaseAnimation } from "./BaseAnimation";
import { write } from "../Logger";

export class DotsAnimation extends BaseAnimation {
  constructor(...args: any[]) {
    super(
      write,
      [".  ", ".. ", "..."],
      200,
      ...args
    );
  }
}
