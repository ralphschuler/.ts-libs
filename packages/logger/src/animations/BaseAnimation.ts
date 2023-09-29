import { IMessage } from "../interfaces/IMessage";

export class BaseAnimation {
  protected frames: string[];
  protected currentFrameIndex: number = 0;
  protected interval: NodeJS.Timeout | null = null;
  protected isAnimating: boolean = false;
  protected frameDelay: number;
  protected proxy: IMessage;
  protected message: string;

  constructor(
    writeFn: (message: string) => IMessage,
    frames: string[],
    frameDelay?: number,
  ) {
    this.frames = frames;
    this.frameDelay = frameDelay || 100;
    this.message = "";
    this.proxy = writeFn(`${this.message}`);
  }

  protected setMessage(message: string) {
    this.message = message;
  }

  private clearCurrentLine() {
    this.message = "";
    this.proxy.clear();
  }

  private printCurrentFrame() {
    const output =
      this.frames[this.currentFrameIndex] +
      (this.message ? ` ${this.message}` : "");
    this.proxy.update(output);
  }

  private moveToNextFrame() {
    this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;
  }

  public start(message?: string) {
    if (message) {
      this.setMessage(message);
    }
    if (this.isAnimating) {
      return;
    }
    this.isAnimating = true;
    this.printCurrentFrame();
    this.interval = setInterval(() => {
      this.printCurrentFrame();
      this.moveToNextFrame();
    }, this.frameDelay);
  }

  public stop(message?: string) {
    if (message) {
      this.setMessage(message);
    }
    if (!this.isAnimating) {
      return;
    }
    clearInterval(this.interval as NodeJS.Timeout);
    this.isAnimating = false;
    this.printCurrentFrame();
  }
}
