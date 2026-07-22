import { BaseScene } from './BaseScene';
import { BottleRenderer } from '../rendering/BottleRenderer';
import { ResponsiveLayout } from '../rendering/ResponsiveLayout';
import { TextureManager } from '../rendering/TextureManager';
import { ServiceContainer } from '../core/ServiceContainer';
import type { Application } from 'pixi.js';

import { runGameplayTests } from '../tests/gameplay.test';
import { runFullQASuite } from '../tests/qa.test';

export class BootScene extends BaseScene {
  public readonly sceneName = 'BootScene';

  private bottles: BottleRenderer[] = [];
  private bottleCount: number = 7;

  public override async onInit(): Promise<void> {
    // Execute pure domain gameplay & QA test suite
    runGameplayTests();
    runFullQASuite();

    const container = ServiceContainer.getInstance();
    if (container.has('pixiApp')) {
      const app = container.get<Application>('pixiApp');
      TextureManager.getInstance().init(app);
    }

    // Instantiate empty bottles
    for (let i = 0; i < this.bottleCount; i++) {
      const bottle = new BottleRenderer({
        width: 80,
        height: 240,
        capacity: 4,
      });
      this.bottles.push(bottle);
      this.addChild(bottle);
    }
  }

  public override async onEnter(): Promise<void> {
    this.onResize(window.innerWidth, window.innerHeight);
  }

  public override onResize(width: number, height: number): void {
    if (this.bottles.length === 0) return;

    const transforms = ResponsiveLayout.calculateLayout({
      screenWidth: width,
      screenHeight: height,
      bottleCount: this.bottleCount,
      baseBottleWidth: 80,
      baseBottleHeight: 240,
      maxColsPerRow: 4,
      paddingX: 30,
      paddingY: 50,
    });

    for (let i = 0; i < this.bottles.length; i++) {
      if (transforms[i]) {
        const bottle = this.bottles[i];
        const tf = transforms[i];
        bottle.x = tf.x;
        bottle.y = tf.y;
        bottle.scale.set(tf.scale);
      }
    }
  }

  public override async onExit(): Promise<void> {
    this.bottles.forEach((bottle) => bottle.destroy());
    this.bottles = [];
  }
}
