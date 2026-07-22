import { Container, Text, TextStyle } from 'pixi.js';
import { ModalOverlay } from './ModalOverlay';
import { UIButton } from './UIButton';
import { AnimationUtils } from '../effects/AnimationUtils';

export interface WinDialogCallbacks {
  onNextLevel?: () => void;
  onLevelSelect?: () => void;
}

export class WinDialog extends Container {
  private overlay: ModalOverlay;

  constructor(levelNumber: number, callbacks: WinDialogCallbacks = {}) {
    super();

    this.overlay = new ModalOverlay({
      title: `LEVEL ${levelNumber} CLEARED!`,
      width: 340,
      height: 320,
    });
    this.addChild(this.overlay);

    const card = this.overlay.getCardContainer();

    const starStyle = new TextStyle({
      fontSize: 38,
      align: 'center',
    });
    const starsText = new Text({ text: '⭐⭐⭐', style: starStyle });
    starsText.anchor.set(0.5, 0);
    starsText.x = 340 / 2;
    starsText.y = 80;
    card.addChild(starsText);

    const nextBtn = new UIButton({
      label: 'Next Level',
      width: 240,
      height: 52,
      backgroundColor: 0x22c55e,
      fontSize: 20,
      onClick: callbacks.onNextLevel,
    });
    nextBtn.x = (340 - 240) / 2;
    nextBtn.y = 150;
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
    selectBtn.y = 220;
    card.addChild(selectBtn);

    AnimationUtils.popIn(card, 0.4);
  }

  public resize(width: number, height: number): void {
    this.overlay.resize(width, height);
  }
}
