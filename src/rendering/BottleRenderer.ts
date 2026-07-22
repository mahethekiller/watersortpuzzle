import { Container, Graphics } from 'pixi.js';
import { LiquidRenderer } from './LiquidRenderer';
import type { LiquidLayerData } from './LiquidRenderer';

export interface BottleRendererConfig {
  width?: number;
  height?: number;
  wallThickness?: number;
  capacity?: number;
  rimHeight?: number;
  glassColor?: number;
  borderColor?: number;
}

export class BottleRenderer extends Container {
  private bottleWidth: number;
  private bottleHeight: number;
  private wallThickness: number;
  private capacity: number;
  private rimHeight: number;
  private glassColor: number;
  private borderColor: number;

  private glassGraphics: Graphics;
  private maskGraphics: Graphics;
  private borderGraphics: Graphics;
  private selectionGraphics: Graphics;
  private liquidRenderer: LiquidRenderer;

  private isSelectedState: boolean = false;

  constructor(config: BottleRendererConfig = {}) {
    super();
    this.bottleWidth = config.width || 80;
    this.bottleHeight = config.height || 240;
    this.wallThickness = config.wallThickness || 6;
    this.capacity = config.capacity || 4;
    this.rimHeight = config.rimHeight || 16;
    this.glassColor = config.glassColor !== undefined ? config.glassColor : 0x1e293b;
    this.borderColor = config.borderColor !== undefined ? config.borderColor : 0x94a3b8;

    this.selectionGraphics = new Graphics();
    this.glassGraphics = new Graphics();
    this.maskGraphics = new Graphics();
    this.borderGraphics = new Graphics();

    this.liquidRenderer = new LiquidRenderer({
      width: this.bottleWidth - this.wallThickness * 2,
      height: this.bottleHeight - this.rimHeight - this.wallThickness,
      capacity: this.capacity,
      borderRadius: (this.bottleWidth - this.wallThickness * 2) / 3,
    });

    this.liquidRenderer.x = this.wallThickness;
    this.liquidRenderer.y = this.rimHeight;
    this.liquidRenderer.mask = this.maskGraphics;

    this.addChild(this.selectionGraphics);
    this.addChild(this.glassGraphics);
    this.addChild(this.maskGraphics);
    this.addChild(this.liquidRenderer);
    this.addChild(this.borderGraphics);

    this.redraw();
  }

  public setCapacity(capacity: number): void {
    this.capacity = capacity;
    this.liquidRenderer.setDimensions(
      this.bottleWidth - this.wallThickness * 2,
      this.bottleHeight - this.rimHeight - this.wallThickness,
      this.capacity
    );
    this.redraw();
  }

  public setLiquidLayers(layers: LiquidLayerData[]): void {
    this.liquidRenderer.setLayers(layers);
  }

  public setSelected(selected: boolean): void {
    this.isSelectedState = selected;
    this.redrawSelection();
  }

  public isSelected(): boolean {
    return this.isSelectedState;
  }

  public setDimensions(width: number, height: number): void {
    this.bottleWidth = width;
    this.bottleHeight = height;
    this.liquidRenderer.x = this.wallThickness;
    this.liquidRenderer.y = this.rimHeight;
    this.liquidRenderer.setDimensions(
      this.bottleWidth - this.wallThickness * 2,
      this.bottleHeight - this.rimHeight - this.wallThickness,
      this.capacity
    );
    this.redraw();
  }

  public redraw(): void {
    const innerW = this.bottleWidth - this.wallThickness * 2;
    const innerH = this.bottleHeight - this.rimHeight - this.wallThickness;
    const innerRadius = innerW / 3;
    const outerRadius = this.bottleWidth / 3;

    // 1. Glass Backing
    this.glassGraphics.clear();
    this.glassGraphics.roundRect(-4, 0, this.bottleWidth + 8, this.rimHeight, 4);
    this.glassGraphics.fill({ color: this.glassColor, alpha: 0.4 });
    this.glassGraphics.roundRect(0, this.rimHeight, this.bottleWidth, this.bottleHeight - this.rimHeight, outerRadius);
    this.glassGraphics.fill({ color: this.glassColor, alpha: 0.35 });

    // 2. Liquid Mask
    this.maskGraphics.clear();
    this.maskGraphics.roundRect(
      this.wallThickness,
      this.rimHeight,
      innerW,
      innerH,
      innerRadius
    );
    this.maskGraphics.fill({ color: 0xffffff });

    // 3. Glass Borders & Highlights
    this.borderGraphics.clear();
    this.borderGraphics.roundRect(0, this.rimHeight, this.bottleWidth, this.bottleHeight - this.rimHeight, outerRadius);
    this.borderGraphics.stroke({ color: this.borderColor, width: this.wallThickness, alpha: 0.8 });

    this.borderGraphics.roundRect(-4, 0, this.bottleWidth + 8, this.rimHeight, 4);
    this.borderGraphics.stroke({ color: this.borderColor, width: 3, alpha: 0.9 });
    this.borderGraphics.fill({ color: 0xffffff, alpha: 0.1 });

    this.borderGraphics.rect(this.wallThickness * 1.5, this.rimHeight + 8, 4, this.bottleHeight - this.rimHeight - 20);
    this.borderGraphics.fill({ color: 0xffffff, alpha: 0.25 });

    this.redrawSelection();
  }

  private redrawSelection(): void {
    this.selectionGraphics.clear();
    if (this.isSelectedState) {
      const outerRadius = this.bottleWidth / 3;
      this.selectionGraphics.roundRect(
        -8,
        -8,
        this.bottleWidth + 16,
        this.bottleHeight + 16,
        outerRadius + 4
      );
      this.selectionGraphics.stroke({ color: 0x38bdf8, width: 4, alpha: 0.9 });
      this.selectionGraphics.fill({ color: 0x38bdf8, alpha: 0.15 });
    }
  }

  public getBottleWidth(): number {
    return this.bottleWidth;
  }

  public getBottleHeight(): number {
    return this.bottleHeight;
  }
}
