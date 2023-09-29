import { BaseAnimation } from "./BaseAnimation";
import { write } from "../Logger";

export class BouncingBallAnimation extends BaseAnimation {
  constructor(...args: any[]) {
    super(
      write,
      [
        "[●         ]",
        "[ ●        ]",
        "[  ●       ]",
        "[   ●      ]",
        "[    ●     ]",
        "[     ●    ]",
        "[      ●   ]",
        "[       ●  ]",
        "[        ● ]",
        "[         ●]",
        "[        ● ]",
        "[       ●  ]",
        "[        ● ]",
        "[         ●]",
        "[        ● ]",
        "[         ●]",
        "[         ●]",
        "[         ●]",
        "[        ● ]",
        "[       ●  ]",
        "[      ●   ]",
        "[     ●    ]",
        "[    ●     ]",
        "[   ●      ]",
        "[  ●       ]",
        "[ ●        ]",
        "[●         ]",
        "[ ●        ]",
        "[  ●       ]",
        "[ ●        ]",
        "[●         ]",
        "[ ●        ]",
        "[●         ]",
        "[●         ]",
      ],
      100,
      ...args
    );
  }
}
