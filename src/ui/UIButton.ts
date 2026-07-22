import { Container, Graphics, Text, TextStyle } from 'pixi.js';

export interface UIButtonConfig {
  label?: string;
  width?: number;
  height?: number;
  backgroundColor?: number;
  textColor?: number;
  borderRadius?: number;
  fontSize?: number;
  onClick?: () => void;
}

export class UIButton extends Container {
  private bgGraphics: Graphics;
  private labelText: Text | null = null;
  private isPressed: boolean = false;
  private isEnabled: boolean = true;

  private buttonWidth: number;
  private buttonHeight: number;
  private bgColor: number;
  private borderRadius: number;
  private onClickHandler?: () => void;

  constructor(config: UIButtonConfig) {
    super();

    this.buttonWidth = config.width || 160;
    this.buttonHeight = config.height || 50;
    this.bgColor = config.backgroundColor !== undefined ? config.backgroundColor : 0x3b82f6;
    this.borderRadius = config.borderRadius !== undefined ? config.borderRadius : 12;
    this.onClickHandler = config.onClick;

    this.bgGraphics = new Graphics();
    this.addChild(this.bgGraphics);

    if (config.label) {
      const style = new TextStyle({
        fontFamily: 'system-ui, sans-serif',
        fontSize: config.fontSize || 18,
        fontWeight: 'bold',
        fill: config.textColor !== undefined ? config.textColor : 0xffffff,
        align: 'center',
      });
      this.labelText = new Text({ text: config.label, style });
      this.labelText.anchor.set(0.5);
      this.labelText.x = this.buttonWidth / 2;
      this.labelText.y = this.buttonHeight / 2;
      this.addChild(this.labelText);
    }

    this.eventMode = 'static';
    this.cursor = 'pointer';

    this.on('pointerdown', this.onPointerDown);
    this.on('pointerup', this.onPointerUp);
    this.on('pointerupoutside', this.onPointerUpOutside);

    this.draw();
  }

  private onPointerDown = (): void => {
    if (!this.isEnabled) return;
    this.isPressed = true;
    this.scale.set(0.94);
  };

  private onPointerUp = (): void => {
    if (!this.isEnabled) return;
    if (this.isPressed) {
      this.isPressed = false;
      this.scale.set(1.0);
      if (this.onClickHandler) {
        this.onClickHandler();
      }
    }
  };

  private onPointerUpOutside = (): void => {
    if (this.isPressed) {
      this.isPressed = false;
      this.scale.set(1.0);
    }
  };

  public setDisabled(disabled: boolean): void {
    this.isEnabled = !disabled;
    this.alpha = disabled ? 0.5 : 1.0;
    this.cursor = disabled ? 'default' : 'pointer';
  }

  private draw(): void {
    this.bgGraphics.clear();
    this.bgGraphics.roundRect(0, 0, this.buttonWidth, this.buttonHeight, this.borderRadius);
    this.bgGraphics.fill({ color: this.bgColor });

    this.bgGraphics.roundRect(2, 2, this.buttonWidth - 4, (this.buttonHeight - 4) / 2, this.borderRadius - 2);
    this.bgGraphics.fill({ color: 0xffffff, alpha: 0.15 });
  }

  public getWidth(): number {
    return this.buttonWidth;
  }

  public getHeight(): number {
    return this.buttonHeight;
  }
}
