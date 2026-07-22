import { Container, Text, TextStyle } from 'pixi.js';
import { ModalOverlay } from './ModalOverlay';
import { UIButton } from './UIButton';
import { AnimationUtils } from '../effects/AnimationUtils';
import { EconomyManager } from '../game/EconomyManager';

export interface WinDialogCallbacks {
  onNextLevel?: () => void;
  onLevelSelect?: () => void;
}

export class WinDialog extends Container {
  private overlay: ModalOverlay;

  constructor(levelNumber: number, movesCount: number, callbacks: WinDialogCallbacks = {}) {
    super();

    // Award economy rewards
    const starsCount = movesCount <= 12 ? 3 : movesCount <= 20 ? 2 : 1;
    const economy = EconomyManager.getInstance();
    economy.addCoins(50);
    economy.setStarsForLevel(levelNumber, starsCount);

    const starsStr = starsCount === 3 ? '⭐⭐⭐' : starsCount === 2 ? '⭐⭐' : '⭐';

    this.overlay = new ModalOverlay({
      title: `LEVEL ${levelNumber} CLEARED!`,
      width: 340,
      height: 350,
    });
    this.addChild(this.overlay);

    const card = this.overlay.getCardContainer();

    const starStyle = new TextStyle({
      fontSize: 36,
      align: 'center',
    });
    const starsText = new Text({ text: starsStr, style: starStyle });
    starsText.anchor.set(0.5, 0);
    starsText.x = 340 / 2;
    starsText.y = 75;
    card.addChild(starsText);

    const rewardStyle = new TextStyle({
      fontFamily: 'system-ui, sans-serif',
      fontSize: 18,
      fontWeight: 'bold',
      fill: 0xfacc15,
      align: 'center',
    });
    const rewardText = new Text({ text: '+50 Coins Received!', style: rewardStyle });
    rewardText.anchor.set(0.5, 0);
    rewardText.x = 340 / 2;
    rewardText.y = 125;
    card.addChild(rewardText);

    const nextBtn = new UIButton({
      label: 'Next Level',
      width: 240,
      height: 50,
      backgroundColor: 0x22c55e,
      fontSize: 20,
      onClick: callbacks.onNextLevel,
    });
    nextBtn.x = (340 - 240) / 2;
    nextBtn.y = 180;
    card.addChild(nextBtn);

    const selectBtn = new UIButton({
      label: 'Level Select',
      width: 240,
      height: 44,
      backgroundColor: 0x0284c7,
      fontSize: 16,
      onClick: callbacks.onLevelSelect,
    });
    selectBtn.x = (340 - 240) / 2;
    selectBtn.y = 245;
    card.addChild(selectBtn);

    AnimationUtils.popIn(card, 0.4);
  }

  public resize(width: number, height: number): void {
    this.overlay.resize(width, height);
  }
}
