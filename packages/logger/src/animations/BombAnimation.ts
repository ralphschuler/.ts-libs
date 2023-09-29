import { BaseAnimation } from "./BaseAnimation";
import { write } from "../Logger";

export class BombAnimation extends BaseAnimation {
  constructor(...args: any[]) {
    super(
      write,
      [
        '[💣   ]',
        '[ 💣  ]',
        '[  💣 ]',
        '[   💣]',
        '[   💣]',
        '[   💣]',
        '[   💣]',
        '[   💣]',
        '[   💥]',
        '[     ]',
        '[     ]'
      ],
      200,
      ...args
    );
  }
}
