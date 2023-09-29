import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { BaseAnimation } from "./animations/BaseAnimation";
import { BallonAnimation } from "./animations/BallonAnimation";
import { BombAnimation } from "./animations/BombAnimation";
import { BouncingBallAnimation } from "./animations/BouncingBallAnimation";
import { ClockAnimation } from "./animations/ClockAnimation";
import { DotsAnimation } from "./animations/DotsAnimation";
import { HorizontalBarAnimation } from "./animations/HorizontalBarAnimation";
import { PongAnimation } from "./animations/PongAnimation";
import { ProgressAnimation } from "./animations/ProgressAnimation";
import { ProgressBarAnimation } from "./animations/ProgressBarAnimation";
import { SpinnerAnimation } from "./animations/SpinnerAnimation";
import { VerticalBarAnimation } from "./animations/VerticalBarAnimation";

const animations = [
  BallonAnimation,
  BombAnimation,
  BouncingBallAnimation,
  ClockAnimation,
  DotsAnimation,
  HorizontalBarAnimation,
  PongAnimation,
  ProgressAnimation,
  SpinnerAnimation,
  VerticalBarAnimation,
];

describe("Animations", async () => {
  let progressStep = 0;
  let progressIntervalId: NodeJS.Timeout;
  let instances = []

  it("should initialize all animations", () => {
    instances = animations.map((Animation) => new Animation());
    instances.push(new ProgressBarAnimation(100));

     instances.forEach((instance) => {
      assert(instance instanceof BaseAnimation);
    })
  });

  it("should start all animations and leave them running for 30 seconds", () => {
    progressIntervalId = setInterval(() => {
      instances.find((instance) => instance instanceof ProgressBarAnimation).setProgress(progressStep++);
    }, 5 / 100);

    instances.forEach((instance) => instance.start(`${instance.constructor.name}...`));

    return new Promise((resolve) => setTimeout(resolve, 30000));
  });

  it("should stop all animations", () => {
    clearInterval(progressIntervalId);

    instances.forEach((instance) => instance.stop(`${instance.constructor.name} done!`));
  });
});
