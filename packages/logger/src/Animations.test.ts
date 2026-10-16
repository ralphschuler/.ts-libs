import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { BaseAnimation } from "./animations/BaseAnimation.js";
import { BallonAnimation } from "./animations/BallonAnimation.js";
import { BombAnimation } from "./animations/BombAnimation.js";
import { BouncingBallAnimation } from "./animations/BouncingBallAnimation.js";
import { ClockAnimation } from "./animations/ClockAnimation.js";
import { DotsAnimation } from "./animations/DotsAnimation.js";
import { HorizontalBarAnimation } from "./animations/HorizontalBarAnimation.js";
import { PongAnimation } from "./animations/PongAnimation.js";
import { ProgressAnimation } from "./animations/ProgressAnimation.js";
import { ProgressBarAnimation } from "./animations/ProgressBarAnimation.js";
import { SpinnerAnimation } from "./animations/SpinnerAnimation.js";
import { VerticalBarAnimation } from "./animations/VerticalBarAnimation.js";

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
  let instances: BaseAnimation[] = [];

  it("should initialize all animations", () => {
    instances = animations.map((Animation) => new Animation());
    instances.push(new ProgressBarAnimation(100));

    instances.forEach((instance) => {
      assert(instance instanceof BaseAnimation);
    });
  });

  it("starts every animation briefly", async () => {
    progressIntervalId = setInterval(() => {
      instances
        .find(
          (instance): instance is ProgressBarAnimation =>
            instance instanceof ProgressBarAnimation,
        )!
        .setProgress(progressStep++);
    }, 5 / 100);

    instances.forEach((instance) =>
      instance.start(`${instance.constructor.name}...`),
    );

    await new Promise((resolve) => setTimeout(resolve, 20));
  });

  it("should stop all animations", () => {
    clearInterval(progressIntervalId);

    instances.forEach((instance) =>
      instance.stop(`${instance.constructor.name} done!`),
    );
  });
});
