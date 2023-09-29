import { BaseAnimation } from "./BaseAnimation.js";
import { write } from "../Logger.js";

const MAX_MESSAGE_LENGTH = 20;

export class ProgressBarAnimation extends BaseAnimation {
  private totalSteps: number;
  private currentStep: number = 0;
  private originalMessage: string = "";

  constructor(totalSteps: number) {
    super(write, [], 100);
    this.totalSteps = totalSteps;
    this.frames = this.generateProgressBarFrames();
  }

  private patchMessage(): void {
    const percentage = Math.floor((this.currentStep / this.totalSteps) * 100);
    const percentageString = `${percentage.toString().padStart(3, " ")}%`;
    const stepString = `${this.currentStep
      .toString()
      .padStart(this.totalSteps.toString().length, " ")}/${this.totalSteps}`;
    const trimmedMessage =
      this.originalMessage.length > MAX_MESSAGE_LENGTH
        ? `${this.originalMessage.substring(0, MAX_MESSAGE_LENGTH - 3)}...`
        : this.originalMessage.length < MAX_MESSAGE_LENGTH
        ? this.originalMessage.padEnd(MAX_MESSAGE_LENGTH, " ")
        : this.originalMessage;
    const messageString = `${stepString} ${percentageString} ${trimmedMessage}`;

    super.setMessage(messageString);
  }

  public setMessage(message: string) {
    this.originalMessage = message;
    this.patchMessage();
  }

  protected moveToNextFrame() {
    if (this.currentFrameIndex < this.currentStep) {
      this.currentFrameIndex =
        (this.currentFrameIndex + 1) % this.frames.length;
    }
  }

  private generateProgressBarFrames(): string[] {
    const frames: string[] = [];

    for (let i = 0; i <= this.totalSteps; i++) {
      const progressBarLength =
        process.stdout.columns - this.originalMessage.length - 34;
      const progressBar = "█".repeat(
        Math.floor(progressBarLength * (i / this.totalSteps)),
      );
      const emptySpace = "▒".repeat(progressBarLength - progressBar.length);
      const progressBarString = `${progressBar}${emptySpace}`;
      const frameString = `${progressBarString}`;

      frames.push(frameString);
    }

    return frames;
  }

  setProgress(step: number) {
    if (step >= 0 && step <= this.totalSteps) {
      this.currentStep = step;
      this.patchMessage();
    }
  }
}
