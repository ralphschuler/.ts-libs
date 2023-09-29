import { ColorName } from "./ColorName.js";

export type Colors = Record<ColorName, (text: string) => string>;
