import { Colors } from '../types/Colors';
import { ColorName } from '../types/ColorName';

export interface IColor extends Colors {
  colorize(text: string, color: ColorName): string;
}
