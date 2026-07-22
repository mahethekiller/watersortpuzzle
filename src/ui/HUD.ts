import { Container, Text, TextStyle } from 'pixi.js';
import { UIButton } from './UIButton';

export interface HUDCallbacks {
  onUndo?: () => void;
  onRestart?: () => void;
  onPause?: () => void;
  onHint?: () => void;
}

export class HUD extends Container {
  private levelText: Text;
  private movesText: Text;
  private coinsText: Text;

  private hintBtn: UIButton;
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

    const subStyle = new TextStyle({
      fontFamily: 'system-ui, sans-serif',
      fontSize: 15,
      fill: 0x94a3b8,
    });

    const coinsStyle = new TextStyle({
      fontFamily: 'system-ui, sans-serif',
      fontSize: 16,
      fontWeight: 'bold',
      fill: 0xfacc15,
    });

    this.levelText = new Text({ text: 'Level 1', style: titleStyle });
    this.movesText = new Text({ text: 'Moves: 0', style: subStyle });
    this.coinsText = new Text({ text: 'Coins: 100', style: coinsStyle });

    this.addChild(this.levelText);
    this.addChild(this.movesText);
    this.addChild(this.coinsText);

    this.hintBtn = new UIButton({
      label: 'Hint',
      width: 70,
      height: 38,
      backgroundColor: 0xeab308,
      fontSize: 14,
      onClick: callbacks.onHint,
    });

    this.undoBtn = new UIButton({
      label: 'Undo',
      width: 70,
      height: 38,
      backgroundColor: 0x6366f1,
      fontSize: 14,
      onClick: callbacks.onUndo,
    });

    this.restartBtn = new UIButton({
      label: 'Restart',
      width: 70,
      height: 38,
      backgroundColor: 0x0284c7,
      fontSize: 14,
      onClick: callbacks.onRestart,
    });

    this.pauseBtn = new UIButton({
      label: 'Pause',
      width: 65,
      height: 38,
      backgroundColor: 0x475569,
      fontSize: 14,
      onClick: callbacks.onPause,
    });

    this.addChild(this.hintBtn);
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

  public setCoins(coins: number): void {
    this.coinsText.text = `Coins: ${coins}`;
  }

  public setUndoDisabled(disabled: boolean): void {
    this.undoBtn.setDisabled(disabled);
  }

  public resize(screenWidth: number): void {
    const padding = 16;

    this.levelText.x = padding;
    this.levelText.y = padding;

    this.movesText.x = padding;
    this.movesText.y = padding + 26;

    this.coinsText.x = padding + 105;
    this.coinsText.y = padding + 26;

    let rightX = screenWidth - padding - 65;
    this.pauseBtn.x = rightX;
    this.pauseBtn.y = padding;

    rightX -= (70 + 8);
    this.restartBtn.x = rightX;
    this.restartBtn.y = padding;

    rightX -= (70 + 8);
    this.undoBtn.x = rightX;
    this.undoBtn.y = padding;

    rightX -= (70 + 8);
    this.hintBtn.x = rightX;
    this.hintBtn.y = padding;
  }
}
