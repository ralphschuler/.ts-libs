import { ColorName } from './ColorName';

export type Colors = Record<ColorName, (text: string) => string>;
