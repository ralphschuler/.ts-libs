import { ColorName } from "./types/ColorName.js";
import { IColor } from "./interfaces/IColor.js";
import { ColorMap } from "./ColorMap.js";

export class Color {
  public colorize(text: string, color: ColorName): string {
    return `${ColorMap[color]}${text}${c.reset("")}`;
  }

  public toIColor(): IColor {
    return new Proxy<IColor>(this as any, {
      get: (target, prop: string) => {
        if (prop === "colorize") {
          return (text: string, color: ColorName) => this.colorize(text, color);
        } else if (prop in ColorMap) {
          return (text: string) => this.colorize(text, prop as ColorName);
        } else {
          return undefined;
        }
      },
    }) as IColor;
  }
}

export const c = new Color().toIColor();
