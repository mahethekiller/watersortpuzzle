import { Container, Graphics } from 'pixi.js';

export interface LiquidLayerData {
  color: number;
  amount: number;
}

export interface LiquidRendererOptions {
  width: number;
  height: number;
  capacity: number;
  borderRadius?: number;
}

export class LiquidRenderer extends Container {
  private graphics: Graphics;
  private bottleWidth: number;
  private bottleHeight: number;
  private capacity: number;
  private borderRadius: number;
  private layers: LiquidLayerData[] = [];

  constructor(options: LiquidRendererOptions) {
    super();
    this.bottleWidth = options.width;
    this.bottleHeight = options.height;
    this.capacity = options.capacity || 4;
    this.borderRadius = options.borderRadius || 20;

    this.graphics = new Graphics();
    this.addChild(this.graphics);
  }

  public setDimensions(width: number, height: number, capacity: number = 4): void {
    this.bottleWidth = width;
    this.bottleHeight = height;
    this.capacity = capacity;
    this.redraw();
  }

  public setLayers(layers: LiquidLayerData[]): void {
    this.layers = [...layers];
    this.redraw();
  }

  public getLayers(): LiquidLayerData[] {
    return [...this.layers];
  }

  public redraw(): void {
    this.graphics.clear();
    if (this.layers.length === 0 || this.capacity <= 0) {
      return;
    }

    const unitHeight = this.bottleHeight / this.capacity;
    let currentY = this.bottleHeight;

    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      const layerHeight = layer.amount * unitHeight;
      const topY = currentY - layerHeight;

      this.graphics.roundRect(
        0,
        topY,
        this.bottleWidth,
        layerHeight,
        i === 0 ? Math.min(this.borderRadius, layerHeight / 2) : 2
      );
      this.graphics.fill({ color: layer.color, alpha: 0.95 });

      // Surface highlight line
      this.graphics.rect(0, topY, this.bottleWidth, Math.min(3, layerHeight / 4));
      this.graphics.fill({ color: 0xffffff, alpha: 0.25 });

      currentY = topY;
    }
  }

  public clear(): void {
    this.layers = [];
    this.graphics.clear();
  }
}
