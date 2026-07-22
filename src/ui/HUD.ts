import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { UIButton } from './UIButton';
import type { HeaderLayoutInfo } from './LayoutManager';

export interface HUDCallbacks {
  onUndo?: () => void;
  onRestart?: () => void;
  onPause?: () => void;
  onHint?: () => void;
}

export class HUD extends Container {
  private levelBadgeBg: Graphics;
  private coinsBadgeBg: Graphics;

  private levelText: Text;
  private coinsText: Text;

  private hintBtn: UIButton;
  private undoBtn: UIButton;
  private restartBtn: UIButton;
  private pauseBtn: UIButton;

  constructor(callbacks: HUDCallbacks = {}) {
    super();

    this.levelBadgeBg = new Graphics();
    this.coinsBadgeBg = new Graphics();
    this.addChild(this.levelBadgeBg);
    this.addChild(this.coinsBadgeBg);

    const badgeStyle = new TextStyle({
      fontFamily: 'system-ui, sans-serif',
      fontSize: 15,
      fontWeight: 'bold',
      fill: 0xf8fafc,
      align: 'center',
    });

    const coinsStyle = new TextStyle({
      fontFamily: 'system-ui, sans-serif',
      fontSize: 15,
      fontWeight: 'bold',
      fill: 0xfacc15,
      align: 'center',
    });

    this.levelText = new Text({ text: 'Level 1', style: badgeStyle });
    this.levelText.anchor.set(0.5);
    this.addChild(this.levelText);

    this.coinsText = new Text({ text: '💰 100', style: coinsStyle });
    this.coinsText.anchor.set(0.5);
    this.addChild(this.coinsText);

    this.hintBtn = new UIButton({
      label: '💡 Hint',
      backgroundColor: 0xeab308,
      fontSize: 13,
      onClick: callbacks.onHint,
    });

    this.undoBtn = new UIButton({
      label: '↩️ Undo',
      backgroundColor: 0x6366f1,
      fontSize: 13,
      onClick: callbacks.onUndo,
    });

    this.restartBtn = new UIButton({
      label: '🔄 Reset',
      backgroundColor: 0x0284c7,
      fontSize: 13,
      onClick: callbacks.onRestart,
    });

    this.pauseBtn = new UIButton({
      label: '⏸️ Menu',
      backgroundColor: 0x475569,
      fontSize: 13,
      onClick: callbacks.onPause,
    });

    this.addChild(this.hintBtn);
    this.addChild(this.undoBtn);
    this.addChild(this.restartBtn);
    this.addChild(this.pauseBtn);
  }

  public setLevel(levelNumber: number): void {
    this.levelText.text = `Level ${levelNumber}`;
  }

  public setMoves(_moves: number): void {
    // Tracked internally
  }

  public setCoins(coins: number): void {
    this.coinsText.text = `💰 ${coins}`;
  }

  public setUndoDisabled(disabled: boolean): void {
    this.undoBtn.setDisabled(disabled);
  }

  public applyHeaderLayout(headerInfo: HeaderLayoutInfo): void {
    const { levelBadgePos, coinsBadgePos, buttons } = headerInfo;

    // Draw Level Pill Badge
    this.levelBadgeBg.clear();
    this.levelBadgeBg.roundRect(
      levelBadgePos.x,
      levelBadgePos.y,
      levelBadgePos.width,
      levelBadgePos.height,
      levelBadgePos.height / 2
    );
    this.levelBadgeBg.fill({ color: 0x1e293b, alpha: 0.95 });
    this.levelBadgeBg.stroke({ color: 0x334155, width: 2 });

    this.levelText.x = levelBadgePos.x + levelBadgePos.width / 2;
    this.levelText.y = levelBadgePos.y + levelBadgePos.height / 2;

    // Draw Coins Pill Badge
    this.coinsBadgeBg.clear();
    this.coinsBadgeBg.roundRect(
      coinsBadgePos.x,
      coinsBadgePos.y,
      coinsBadgePos.width,
      coinsBadgePos.height,
      coinsBadgePos.height / 2
    );
    this.coinsBadgeBg.fill({ color: 0x1e293b, alpha: 0.95 });
    this.coinsBadgeBg.stroke({ color: 0x334155, width: 2 });

    this.coinsText.x = coinsBadgePos.x + coinsBadgePos.width / 2;
    this.coinsText.y = coinsBadgePos.y + coinsBadgePos.height / 2;

    // Position Action Buttons
    buttons.forEach((btnData) => {
      let buttonInstance: UIButton | null = null;
      if (btnData.id === 'hint') buttonInstance = this.hintBtn;
      else if (btnData.id === 'undo') buttonInstance = this.undoBtn;
      else if (btnData.id === 'restart') buttonInstance = this.restartBtn;
      else if (btnData.id === 'pause') buttonInstance = this.pauseBtn;

      if (buttonInstance) {
        buttonInstance.x = btnData.x;
        buttonInstance.y = btnData.y;
        buttonInstance.setDimensions(btnData.width, btnData.height);
      }
    });
  }
}
