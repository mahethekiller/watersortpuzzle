import { BaseScene } from './BaseScene';
import { BottleRenderer } from '../rendering/BottleRenderer';
import { ResponsiveLayout } from '../rendering/ResponsiveLayout';
import { TextureManager } from '../rendering/TextureManager';
import { ServiceContainer } from '../core/ServiceContainer';
import { SceneManager } from '../core/SceneManager';
import { LevelManager } from '../levels/LevelManager';
import { WaterSortGame } from '../game/WaterSortGame';
import { HUD } from '../ui/HUD';
import { PauseModal } from '../ui/PauseModal';
import type { Application } from 'pixi.js';

export class GameScene extends BaseScene {
  public readonly sceneName = 'GameScene';

  private levelManager: LevelManager;
  private game: WaterSortGame;
  private bottleRenderers: Map<number, BottleRenderer> = new Map();
  private hud: HUD;
  private pauseModal: PauseModal | null = null;

  constructor() {
    super();
    this.levelManager = new LevelManager();
    this.game = new WaterSortGame();

    this.hud = new HUD({
      onUndo: () => this.handleUndo(),
      onRestart: () => this.handleRestart(),
      onPause: () => this.handlePause(),
    });
  }

  public override async onInit(): Promise<void> {
    const container = ServiceContainer.getInstance();
    if (container.has('pixiApp')) {
      const app = container.get<Application>('pixiApp');
      TextureManager.getInstance().init(app);
    }

    this.loadCurrentLevel();
    this.addChild(this.hud);
  }

  private loadCurrentLevel(): void {
    this.bottleRenderers.forEach((renderer) => renderer.destroy());
    this.bottleRenderers.clear();

    const levelConfig = this.levelManager.getCurrentLevelConfig();
    if (!levelConfig) return;

    this.game.initLevel(levelConfig.bottles);

    this.hud.setLevel(levelConfig.levelNumber);
    this.hud.setMoves(0);
    this.hud.setUndoDisabled(true);

    for (const bottleData of levelConfig.bottles) {
      const bottleRenderer = new BottleRenderer({
        width: 80,
        height: 240,
        capacity: levelConfig.capacity || 4,
      });

      bottleRenderer.setLiquidLayers(bottleData.layers);
      bottleRenderer.eventMode = 'static';
      bottleRenderer.cursor = 'pointer';
      bottleRenderer.on('pointerdown', () => this.onBottleTapped(bottleData.id));

      this.bottleRenderers.set(bottleData.id, bottleRenderer);
      this.addChild(bottleRenderer);
    }

    // Ensure HUD is on top
    this.setChildIndex(this.hud, this.children.length - 1);

    this.onResize(window.innerWidth, window.innerHeight);
  }

  private onBottleTapped(bottleId: number): void {
    if (this.pauseModal) return;

    const response = this.game.selectBottle(bottleId);
    this.updateRenderState();

    if (response.action === 'poured' && this.game.checkIsWon()) {
      setTimeout(() => {
        this.levelManager.completeCurrentLevel();
        this.loadCurrentLevel();
      }, 400);
    }
  }

  private handleUndo(): void {
    if (this.pauseModal) return;
    const undone = this.game.undo();
    if (undone) {
      this.updateRenderState();
    }
  }

  private handleRestart(): void {
    if (this.pauseModal) return;
    const levelConfig = this.levelManager.getCurrentLevelConfig();
    if (levelConfig) {
      this.game.restart(levelConfig.bottles);
      this.updateRenderState();
    }
  }

  private handlePause(): void {
    if (!this.pauseModal) {
      this.pauseModal = new PauseModal({
        onResume: () => this.closePauseModal(),
        onRestart: () => {
          this.closePauseModal();
          this.handleRestart();
        },
        onLevelSelect: () => {
          this.closePauseModal();
          const sceneMgr = ServiceContainer.getInstance().get<SceneManager>('sceneManager');
          sceneMgr.changeScene('LevelSelectScene');
        },
      });
      this.addChild(this.pauseModal);
      this.pauseModal.resize(window.innerWidth, window.innerHeight);
    }
  }

  private closePauseModal(): void {
    if (this.pauseModal) {
      this.removeChild(this.pauseModal);
      this.pauseModal.destroy();
      this.pauseModal = null;
    }
  }

  private updateRenderState(): void {
    const selectedId = this.game.getSelectedBottleId();
    const bottles = this.game.getBottles();

    for (const bottleModel of bottles) {
      const renderer = this.bottleRenderers.get(bottleModel.id);
      if (renderer) {
        renderer.setSelected(bottleModel.id === selectedId);
        renderer.setLiquidLayers([...bottleModel.getLayers()]);
      }
    }

    const moveCount = this.game.getMoveCount();
    this.hud.setMoves(moveCount);
    this.hud.setUndoDisabled(moveCount === 0);
  }

  public override onResize(width: number, height: number): void {
    this.hud.resize(width);

    const bottleCount = this.bottleRenderers.size;
    if (bottleCount === 0) return;

    const transforms = ResponsiveLayout.calculateLayout({
      screenWidth: width,
      screenHeight: height,
      bottleCount: bottleCount,
      baseBottleWidth: 80,
      baseBottleHeight: 240,
      maxColsPerRow: Math.min(bottleCount, 5),
      paddingX: 24,
      paddingY: 40,
    });

    let idx = 0;
    this.bottleRenderers.forEach((renderer) => {
      if (transforms[idx]) {
        const tf = transforms[idx];
        renderer.x = tf.x;
        renderer.y = tf.y;
        renderer.scale.set(tf.scale);
      }
      idx++;
    });

    if (this.pauseModal) {
      this.pauseModal.resize(width, height);
    }
  }

  public override async onExit(): Promise<void> {
    this.closePauseModal();
    this.bottleRenderers.forEach((renderer) => renderer.destroy());
    this.bottleRenderers.clear();
  }
}
