import { Container, Graphics } from 'pixi.js';
import { BottleRenderer } from './BottleRenderer';
import type { BottleRendererConfig } from './BottleRenderer';

export class SpriteFactory {
  public static createBottle(config: BottleRendererConfig = {}): BottleRenderer {
    return new BottleRenderer(config);
  }

  public static createBackground(width: number, height: number): Container {
    const container = new Container();
    const bg = new Graphics();

    bg.rect(0, 0, width, height);
    bg.fill({ color: 0x0f172a });

    container.addChild(bg);
    return container;
  }
}
