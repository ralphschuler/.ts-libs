import { BaseAnimation } from "./BaseAnimation";
import { write } from "../Logger";

export class PongAnimation extends BaseAnimation {
  constructor(...args: any[]) {
    super(
      write,
      [
        '▐⠂       ▌',
        '▐⠈       ▌',
        '▐ ⠂      ▌',
        '▐ ⠠      ▌',
        '▐  ⡀     ▌',
        '▐  ⠠     ▌',
        '▐   ⠂    ▌',
        '▐   ⠈    ▌',
        '▐    ⠂   ▌',
        '▐    ⠠   ▌',
        '▐     ⡀  ▌',
        '▐     ⠠  ▌',
        '▐      ⠂ ▌',
        '▐      ⠈ ▌',
        '▐       ⠂▌',
        '▐       ⠠▌',
        '▐       ⡀▌',
        '▐      ⠠ ▌',
        '▐      ⠂ ▌',
        '▐     ⠈  ▌',
        '▐     ⠂  ▌',
        '▐    ⠠   ▌',
        '▐    ⡀   ▌',
        '▐   ⠠    ▌',
        '▐   ⠂    ▌',
        '▐  ⠈     ▌',
        '▐  ⠂     ▌',
        '▐ ⠠      ▌',
        '▐ ⡀      ▌',
        '▐⠠       ▌'
      ],
      100,
      ...args
    );
  }
}
