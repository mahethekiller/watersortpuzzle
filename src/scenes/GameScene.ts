import { BaseScene } from './BaseScene';
import { BottleRenderer } from '../rendering/BottleRenderer';
import { ResponsiveLayout } from '../rendering/ResponsiveLayout';
import { TextureManager } from '../rendering/TextureManager';
import { ServiceContainer } from '../core/ServiceContainer';
import { LevelManager } from '../levels/LevelManager';
import { WaterSortGame } from '../game/WaterSortGame';
import type { Application } from 'pixi.js';

export class GameScene extends BaseScene {
  public readonly sceneName = 'GameScene';

  private levelManager: LevelManager;
  private game: WaterSortGame;
  private bottleRenderers: Map<number, BottleRenderer> = new Map();

  constructor() {
    super();
    this.levelManager = new LevelManager();
    this.game = new WaterSortGame();
  }

  public override async onInit(): Promise<void> {
    const container = ServiceContainer.getInstance();
    if (container.has('pixiApp')) {
      const app = container.get<Application>('pixiApp');
      TextureManager.getInstance().init(app);
    }

    this.loadCurrentLevel();
  }

  private loadCurrentLevel(): void {
    // Clear previous renderers
    this.bottleRenderers.forEach((renderer) => renderer.destroy());
    this.bottleRenderers.clear();

    const levelConfig = this.levelManager.getCurrentLevelConfig();
    if (!levelConfig) return;

    // Initialize game domain model
    this.game.initLevel(levelConfig.bottles);

    // Create rendering components for each bottle
    for (const bottleData of levelConfig.bottles) {
      const bottleRenderer = new BottleRenderer({
        width: 80,
        height: 240,
        capacity: levelConfig.capacity || 4,
      });

      // Set initial liquid layers
      bottleRenderer.setLiquidLayers(bottleData.layers);

      // Make bottle interactive
      bottleRenderer.eventMode = 'static';
      bottleRenderer.cursor = 'pointer';
      bottleRenderer.on('pointerdown', () => this.onBottleTapped(bottleData.id));

      this.bottleRenderers.set(bottleData.id, bottleRenderer);
      this.addChild(bottleRenderer);
    }

    this.onResize(window.innerWidth, window.innerHeight);
  }

  private onBottleTapped(bottleId: number): void {
    const response = this.game.selectBottle(bottleId);
    this.updateRenderState();

    if (response.action === 'poured' && this.game.checkIsWon()) {
      setTimeout(() => {
        this.levelManager.completeCurrentLevel();
        this.loadCurrentLevel();
      }, 400);
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
  }

  public override onResize(width: number, height: number): void {
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
  }

  public override async onExit(): Promise<void> {
    this.bottleRenderers.forEach((renderer) => renderer.destroy());
    this.bottleRenderers.clear();
  }
}
