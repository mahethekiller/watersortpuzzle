import { Container, Text, TextStyle } from 'pixi.js';
import { UIButton } from './UIButton';

export interface HUDCallbacks {
  onUndo?: () => void;
  onRestart?: () => void;
  onPause?: () => void;
}

export class HUD extends Container {
  private levelText: Text;
  private movesText: Text;

  private undoBtn: UIButton;
  private restartBtn: UIButton;
  private pauseBtn: UIButton;

  constructor(callbacks: HUDCallbacks = {}) {
    super();

    const titleStyle = new TextStyle({
      fontFamily: 'system-ui, sans-serif',
      fontSize: 22,
      fontWeight: 'bold',
      fill: 0xf8fafc,
    });

    const movesStyle = new TextStyle({
      fontFamily: 'system-ui, sans-serif',
      fontSize: 16,
      fill: 0x94a3b8,
    });

    this.levelText = new Text({ text: 'Level 1', style: titleStyle });
    this.movesText = new Text({ text: 'Moves: 0', style: movesStyle });

    this.addChild(this.levelText);
    this.addChild(this.movesText);

    this.undoBtn = new UIButton({
      label: 'Undo',
      width: 75,
      height: 38,
      backgroundColor: 0x6366f1,
      fontSize: 14,
      onClick: callbacks.onUndo,
    });

    this.restartBtn = new UIButton({
      label: 'Restart',
      width: 75,
      height: 38,
      backgroundColor: 0x0284c7,
      fontSize: 14,
      onClick: callbacks.onRestart,
    });

    this.pauseBtn = new UIButton({
      label: 'Pause',
      width: 75,
      height: 38,
      backgroundColor: 0x475569,
      fontSize: 14,
      onClick: callbacks.onPause,
    });

    this.addChild(this.undoBtn);
    this.addChild(this.restartBtn);
    this.addChild(this.pauseBtn);

    this.resize(window.innerWidth);
  }

  public setLevel(levelNumber: number): void {
    this.levelText.text = `Level ${levelNumber}`;
  }

  public setMoves(moves: number): void {
    this.movesText.text = `Moves: ${moves}`;
  }

  public setUndoDisabled(disabled: boolean): void {
    this.undoBtn.setDisabled(disabled);
  }

  public resize(screenWidth: number): void {
    const padding = 20;

    this.levelText.x = padding;
    this.levelText.y = padding;

    this.movesText.x = padding;
    this.movesText.y = padding + 28;

    let rightX = screenWidth - padding - 75;
    this.pauseBtn.x = rightX;
    this.pauseBtn.y = padding;

    rightX -= (75 + 10);
    this.restartBtn.x = rightX;
    this.restartBtn.y = padding;

    rightX -= (75 + 10);
    this.undoBtn.x = rightX;
    this.undoBtn.y = padding;
  }
}
