export interface IMessage {
  index: number;
  value: string;
  update: (newValue: string) => void;
  clear: () => void;
}
