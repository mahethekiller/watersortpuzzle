import { Container } from 'pixi.js';
import { ModalOverlay } from './ModalOverlay';
import { UIButton } from './UIButton';

export interface PauseModalCallbacks {
  onResume?: () => void;
  onRestart?: () => void;
  onLevelSelect?: () => void;
}

export class PauseModal extends Container {
  private overlay: ModalOverlay;

  constructor(callbacks: PauseModalCallbacks = {}) {
    super();

    this.overlay = new ModalOverlay({
      title: 'Game Paused',
      width: 320,
      height: 340,
    });
    this.addChild(this.overlay);

    const card = this.overlay.getCardContainer();

    const resumeBtn = new UIButton({
      label: 'Resume',
      width: 240,
      height: 48,
      backgroundColor: 0x22c55e,
      onClick: callbacks.onResume,
    });
    resumeBtn.x = (320 - 240) / 2;
    resumeBtn.y = 90;

    const restartBtn = new UIButton({
      label: 'Restart Level',
      width: 240,
      height: 48,
      backgroundColor: 0x0284c7,
      onClick: callbacks.onRestart,
    });
    restartBtn.x = (320 - 240) / 2;
    restartBtn.y = 155;

    const levelSelectBtn = new UIButton({
      label: 'Level Select',
      width: 240,
      height: 48,
      backgroundColor: 0x6366f1,
      onClick: callbacks.onLevelSelect,
    });
    levelSelectBtn.x = (320 - 240) / 2;
    levelSelectBtn.y = 220;

    card.addChild(resumeBtn);
    card.addChild(restartBtn);
    card.addChild(levelSelectBtn);
  }

  public resize(width: number, height: number): void {
    this.overlay.resize(width, height);
  }
}
