import { Text, TextStyle } from 'pixi.js';
import { BaseScene } from './BaseScene';
import { UIButton } from '../ui/UIButton';
import { SettingsModal } from '../ui/SettingsModal';
import { ServiceContainer } from '../core/ServiceContainer';
import { SceneManager } from '../core/SceneManager';
import { LevelManager } from '../levels/LevelManager';

export class MainMenuScene extends BaseScene {
  public readonly sceneName = 'MainMenuScene';

  private titleText: Text;
  private subtitleText: Text;

  private playBtn: UIButton;
  private levelSelectBtn: UIButton;
  private settingsBtn: UIButton;
  private settingsModal: SettingsModal | null = null;
  private levelManager: LevelManager;

  constructor() {
    super();
    this.levelManager = new LevelManager();

    const titleStyle = new TextStyle({
      fontFamily: 'system-ui, sans-serif',
      fontSize: 40,
      fontWeight: 'bold',
      fill: 0x38bdf8,
      stroke: { color: 0x0f172a, width: 4 },
      align: 'center',
    });

    const subStyle = new TextStyle({
      fontFamily: 'system-ui, sans-serif',
      fontSize: 18,
      fill: 0x94a3b8,
      align: 'center',
    });

    this.titleText = new Text({ text: 'WATER SORT', style: titleStyle });
    this.titleText.anchor.set(0.5);
    this.addChild(this.titleText);

    this.subtitleText = new Text({ text: 'Puzzle Game', style: subStyle });
    this.subtitleText.anchor.set(0.5);
    this.addChild(this.subtitleText);

    const currentLvl = this.levelManager.getCurrentLevelNumber();

    this.playBtn = new UIButton({
      label: `Play Level ${currentLvl}`,
      width: 260,
      height: 60,
      backgroundColor: 0x22c55e,
      fontSize: 22,
      onClick: () => this.onPlayClicked(),
    });
    this.addChild(this.playBtn);

    this.levelSelectBtn = new UIButton({
      label: 'Level Select',
      width: 260,
      height: 52,
      backgroundColor: 0x0284c7,
      fontSize: 18,
      onClick: () => this.onLevelSelectClicked(),
    });
    this.addChild(this.levelSelectBtn);

    this.settingsBtn = new UIButton({
      label: 'Settings',
      width: 260,
      height: 52,
      backgroundColor: 0x475569,
      fontSize: 18,
      onClick: () => this.onSettingsClicked(),
    });
    this.addChild(this.settingsBtn);
  }

  private onPlayClicked(): void {
    const sceneMgr = ServiceContainer.getInstance().get<SceneManager>('sceneManager');
    sceneMgr.changeScene('GameScene');
  }

  private onLevelSelectClicked(): void {
    const sceneMgr = ServiceContainer.getInstance().get<SceneManager>('sceneManager');
    sceneMgr.changeScene('LevelSelectScene');
  }

  private onSettingsClicked(): void {
    if (!this.settingsModal) {
      this.settingsModal = new SettingsModal({
        onClose: () => {
          if (this.settingsModal) {
            this.removeChild(this.settingsModal);
            this.settingsModal.destroy();
            this.settingsModal = null;
          }
        },
        onResetData: () => {
          this.levelManager = new LevelManager();
          if (this.settingsModal) {
            this.removeChild(this.settingsModal);
            this.settingsModal.destroy();
            this.settingsModal = null;
          }
          const sceneMgr = ServiceContainer.getInstance().get<SceneManager>('sceneManager');
          sceneMgr.changeScene('MainMenuScene');
        },
      });
      this.addChild(this.settingsModal);
      this.onResize(window.innerWidth, window.innerHeight);
    }
  }

  public override onResize(width: number, height: number): void {
    const centerX = width / 2;

    this.titleText.x = centerX;
    this.titleText.y = height * 0.24;

    this.subtitleText.x = centerX;
    this.subtitleText.y = height * 0.31;

    const btnStartX = centerX - 130;
    let startY = height * 0.45;

    this.playBtn.x = btnStartX;
    this.playBtn.y = startY;

    startY += 80;
    this.levelSelectBtn.x = btnStartX;
    this.levelSelectBtn.y = startY;

    startY += 70;
    this.settingsBtn.x = btnStartX;
    this.settingsBtn.y = startY;

    if (this.settingsModal) {
      this.settingsModal.resize(width, height);
    }
  }
}
