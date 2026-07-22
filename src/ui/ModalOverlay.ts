import { Container, Graphics, Text, TextStyle } from 'pixi.js';

export interface ModalOverlayOptions {
  title?: string;
  width?: number;
  height?: number;
}

export class ModalOverlay extends Container {
  private backdrop: Graphics;
  private cardContainer: Container;
  private cardBg: Graphics;
  private titleText: Text | null = null;

  private cardWidth: number;
  private cardHeight: number;

  constructor(options: ModalOverlayOptions = {}) {
    super();

    this.cardWidth = options.width || 360;
    this.cardHeight = options.height || 420;

    this.backdrop = new Graphics();
    this.backdrop.eventMode = 'static';
    this.addChild(this.backdrop);

    this.cardContainer = new Container();
    this.addChild(this.cardContainer);

    this.cardBg = new Graphics();
    this.cardContainer.addChild(this.cardBg);

    if (options.title) {
      const style = new TextStyle({
        fontFamily: 'system-ui, sans-serif',
        fontSize: 24,
        fontWeight: 'bold',
        fill: 0xf8fafc,
        align: 'center',
      });
      this.titleText = new Text({ text: options.title, style });
      this.titleText.anchor.set(0.5, 0);
      this.titleText.x = this.cardWidth / 2;
      this.titleText.y = 24;
      this.cardContainer.addChild(this.titleText);
    }

    this.resize(window.innerWidth, window.innerHeight);
  }

  public getCardContainer(): Container {
    return this.cardContainer;
  }

  public resize(screenWidth: number, screenHeight: number): void {
    this.backdrop.clear();
    this.backdrop.rect(0, 0, screenWidth, screenHeight);
    this.backdrop.fill({ color: 0x000000, alpha: 0.65 });

    const clampedW = Math.min(this.cardWidth, screenWidth * 0.9);
    const clampedH = Math.min(this.cardHeight, screenHeight * 0.85);

    this.cardBg.clear();
    this.cardBg.roundRect(0, 0, clampedW, clampedH, 20);
    this.cardBg.fill({ color: 0x1e293b });
    this.cardBg.stroke({ color: 0x475569, width: 3 });

    this.cardContainer.x = (screenWidth - clampedW) / 2;
    this.cardContainer.y = (screenHeight - clampedH) / 2;

    if (this.titleText) {
      this.titleText.x = clampedW / 2;
    }
  }
}
