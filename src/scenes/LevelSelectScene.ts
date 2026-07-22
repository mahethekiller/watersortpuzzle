import { Text, TextStyle } from 'pixi.js';
import { BaseScene } from './BaseScene';
import { LevelManager } from '../levels/LevelManager';
import { UIButton } from '../ui/UIButton';
import { ServiceContainer } from '../core/ServiceContainer';
import { SceneManager } from '../core/SceneManager';

export class LevelSelectScene extends BaseScene {
  public readonly sceneName = 'LevelSelectScene';

  private titleText: Text;
  private backBtn: UIButton;
  private levelButtons: UIButton[] = [];
  private levelManager: LevelManager;

  constructor() {
    super();
    this.levelManager = new LevelManager();

    const titleStyle = new TextStyle({
      fontFamily: 'system-ui, sans-serif',
      fontSize: 32,
      fontWeight: 'bold',
      fill: 0xf8fafc,
      align: 'center',
    });
    this.titleText = new Text({ text: 'Select Level', style: titleStyle });
    this.titleText.anchor.set(0.5, 0);
    this.addChild(this.titleText);

    this.backBtn = new UIButton({
      label: 'Back',
      width: 100,
      height: 40,
      backgroundColor: 0x475569,
      fontSize: 16,
      onClick: () => this.onBackClicked(),
    });
    this.addChild(this.backBtn);

    this.createLevelGrid();
  }

  private createLevelGrid(): void {
    const totalLevels = this.levelManager.getTotalLevels();
    const maxUnlocked = this.levelManager.getMaxUnlockedLevel();
    const currentLevel = this.levelManager.getCurrentLevelNumber();

    for (let i = 1; i <= totalLevels; i++) {
      const isUnlocked = i <= maxUnlocked;
      const isCurrent = i === currentLevel;

      const btn = new UIButton({
        label: isUnlocked ? `${i}` : '🔒',
        width: 60,
        height: 60,
        backgroundColor: isCurrent ? 0x22c55e : isUnlocked ? 0x0284c7 : 0x334155,
        fontSize: 18,
        onClick: () => {
          if (isUnlocked) {
            this.levelManager.setCurrentLevel(i);
            const sceneMgr = ServiceContainer.getInstance().get<SceneManager>('sceneManager');
            sceneMgr.changeScene('GameScene');
          }
        },
      });

      if (!isUnlocked) {
        btn.setDisabled(true);
      }

      this.levelButtons.push(btn);
      this.addChild(btn);
    }
  }

  private onBackClicked(): void {
    const sceneMgr = ServiceContainer.getInstance().get<SceneManager>('sceneManager');
    sceneMgr.changeScene('MainMenuScene');
  }

  public override onResize(width: number, _height: number): void {
    this.titleText.x = width / 2;
    this.titleText.y = 30;

    this.backBtn.x = 20;
    this.backBtn.y = 26;

    const cols = Math.min(5, Math.floor((width - 40) / 75));
    const btnW = 60;
    const btnH = 60;
    const gapX = 15;
    const gapY = 15;

    const gridW = cols * btnW + (cols - 1) * gapX;
    const startX = (width - gridW) / 2;
    const startY = 110;

    this.levelButtons.forEach((btn, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);

      btn.x = startX + col * (btnW + gapX);
      btn.y = startY + row * (btnH + gapY);
    });
  }
}
