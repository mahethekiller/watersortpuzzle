import gsap from 'gsap';
import type { BottleRenderer } from '../rendering/BottleRenderer';
import type { LiquidStreamEffect } from './LiquidStreamEffect';

export class BottleAnimator {
  public static lift(bottle: BottleRenderer, targetY: number): Promise<void> {
    return new Promise((resolve) => {
      gsap.to(bottle, {
        y: targetY - 25,
        duration: 0.2,
        ease: 'power2.out',
        onComplete: resolve,
      });
    });
  }

  public static drop(bottle: BottleRenderer, targetY: number): Promise<void> {
    return new Promise((resolve) => {
      gsap.to(bottle, {
        y: targetY,
        duration: 0.2,
        ease: 'power2.out',
        onComplete: resolve,
      });
    });
  }

  public static animatePour(
    sourceBottle: BottleRenderer,
    targetBottle: BottleRenderer,
    streamEffect: LiquidStreamEffect,
    liquidColor: number,
    origSourceX: number,
    origSourceY: number
  ): Promise<void> {
    return new Promise((resolve) => {
      const isLeft = sourceBottle.x < targetBottle.x;
      const tiltAngle = isLeft ? 1.2 : -1.2;

      const targetTopX = targetBottle.x + targetBottle.getBottleWidth() / 2;
      const targetTopY = targetBottle.y;

      const pourX = isLeft ? targetTopX - 60 : targetTopX + 60;
      const pourY = targetTopY - 40;

      const tl = gsap.timeline();

      tl.to(sourceBottle, {
        x: pourX,
        y: pourY,
        duration: 0.3,
        ease: 'power2.inOut',
      });

      tl.to(sourceBottle, {
        rotation: tiltAngle,
        duration: 0.25,
        ease: 'power1.out',
        onStart: () => {
          const lipX = sourceBottle.x + (isLeft ? 40 : -40);
          const lipY = sourceBottle.y + 10;
          streamEffect.animateStream(lipX, lipY, targetTopX, targetTopY + 20, liquidColor, 0.45);
        },
      });

      tl.to({}, { duration: 0.4 });

      tl.to(sourceBottle, {
        rotation: 0,
        duration: 0.25,
        ease: 'power1.in',
      });

      tl.to(sourceBottle, {
        x: origSourceX,
        y: origSourceY,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => resolve(),
      });
    });
  }
}
