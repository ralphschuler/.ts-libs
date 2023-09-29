import { Colors } from "../types/Colors.js";
import { ColorName } from "../types/ColorName.js";

export interface IColor extends Colors {
  colorize(text: string, color: ColorName): string;
}
