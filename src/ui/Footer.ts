import { Container, Graphics, Text, TextStyle } from 'pixi.js';

export class Footer extends Container {
  private bgGraphics: Graphics;
  private infoText: Text;

  constructor() {
    super();

    this.bgGraphics = new Graphics();
    this.addChild(this.bgGraphics);

    const style = new TextStyle({
      fontFamily: 'system-ui, sans-serif',
      fontSize: 13,
      fontWeight: 'bold',
      fill: 0x475569,
      align: 'center',
    });

    this.infoText = new Text({ text: 'WATER SORT PUZZLE', style });
    this.infoText.anchor.set(0.5);
    this.addChild(this.infoText);
  }

  public resize(x: number, y: number, width: number, height: number): void {
    this.x = x;
    this.y = y;

    this.bgGraphics.clear();
    this.bgGraphics.rect(0, 0, width, 1);
    this.bgGraphics.fill({ color: 0x334155, alpha: 0.4 });

    this.infoText.x = width / 2;
    this.infoText.y = height / 2;
  }
}
