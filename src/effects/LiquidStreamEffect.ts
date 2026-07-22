import { Container, Graphics } from 'pixi.js';
import gsap from 'gsap';

export class LiquidStreamEffect extends Container {
  private graphics: Graphics;

  constructor() {
    super();
    this.graphics = new Graphics();
    this.addChild(this.graphics);
  }

  public animateStream(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: number,
    duration: number = 0.4
  ): Promise<void> {
    return new Promise((resolve) => {
      this.graphics.clear();

      const progressObj = { progress: 0 };
      gsap.to(progressObj, {
        progress: 1,
        duration,
        ease: 'power1.inOut',
        onUpdate: () => {
          this.graphics.clear();
          const currentY = fromY + (toY - fromY) * progressObj.progress;

          this.graphics.moveTo(fromX, fromY);
          this.graphics.lineTo(toX, currentY);
          this.graphics.stroke({ color, width: 6, alpha: 0.9, cap: 'round' });
        },
        onComplete: () => {
          this.graphics.clear();
          resolve();
        },
      });
    });
  }

  public clear(): void {
    this.graphics.clear();
  }
}
