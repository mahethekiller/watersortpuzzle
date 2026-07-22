import { Text, TextStyle } from 'pixi.js';
import { BaseScene } from './BaseScene';
import { LevelManager } from '../levels/LevelManager';
import { EconomyManager } from '../game/EconomyManager';
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
      fontSize: 28,
      fontWeight: 'bold',
      fill: 0xf8fafc,
      align: 'center',
    });
    this.titleText = new Text({ text: 'Select Level', style: titleStyle });
    this.titleText.anchor.set(0.5, 0.5);
    this.addChild(this.titleText);

    this.backBtn = new UIButton({
      label: 'Back',
      width: 85,
      height: 38,
      backgroundColor: 0x475569,
      fontSize: 15,
      onClick: () => this.onBackClicked(),
    });
    this.addChild(this.backBtn);

    this.createLevelGrid();
  }

  private createLevelGrid(): void {
    const totalLevels = this.levelManager.getTotalLevels();
    const maxUnlocked = this.levelManager.getMaxUnlockedLevel();
    const currentLevel = this.levelManager.getCurrentLevelNumber();
    const economy = EconomyManager.getInstance();

    for (let i = 1; i <= totalLevels; i++) {
      const isUnlocked = i <= maxUnlocked;
      const isCurrent = i === currentLevel;
      const starsCount = economy.getStarsForLevel(i);
      const starBadge = starsCount > 0 ? '\n' + '⭐'.repeat(starsCount) : '';

      const btn = new UIButton({
        label: isUnlocked ? `${i}${starBadge}` : '🔒',
        width: 60,
        height: 60,
        backgroundColor: isCurrent ? 0x22c55e : isUnlocked ? 0x0284c7 : 0x334155,
        fontSize: starsCount > 0 ? 13 : 17,
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

  public override onResize(width: number, height: number): void {
    const paddingX = Math.min(20, Math.floor(width * 0.04));
    const topY = Math.max(16, Math.floor(height * 0.03));

    this.backBtn.x = paddingX;
    this.backBtn.y = topY;

    this.titleText.x = width / 2;
    this.titleText.y = topY + 19;

    const cols = Math.min(5, Math.floor((width - paddingX * 2) / 68));
    const btnW = Math.min(64, Math.floor((width - paddingX * 2 - (cols - 1) * 12) / cols));
    const btnH = btnW;
    const gapX = 12;
    const gapY = 12;

    const gridW = cols * btnW + (cols - 1) * gapX;
    const startX = (width - gridW) / 2;
    const startY = topY + 55;

    this.levelButtons.forEach((btn, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);

      btn.setDimensions(btnW, btnH);
      btn.x = startX + col * (btnW + gapX);
      btn.y = startY + row * (btnH + gapY);
    });
  }
}
