import { BaseAnimation } from "./BaseAnimation";
import { write } from "../Logger";

export class ProgressAnimation extends BaseAnimation {
  constructor(...args: any[]) {
    super(
      write,
      [
        "[    ]",
        "[=   ]",
        "[==  ]",
        "[=== ]",
        "[====]",
        "[=== ]",
        "[==  ]",
        "[=   ]",
      ],
      200,
      ...args
    );
  }
}
