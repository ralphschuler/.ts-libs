export interface IMessage = {
  value: string;
  update: (newValue: string) => void;
  clear: () => void;
}
