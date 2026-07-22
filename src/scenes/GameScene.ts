import { BaseScene } from './BaseScene';
import { BottleRenderer } from '../rendering/BottleRenderer';
import { ResponsiveLayout } from '../rendering/ResponsiveLayout';
import { TextureManager } from '../rendering/TextureManager';
import { ServiceContainer } from '../core/ServiceContainer';
import { SceneManager } from '../core/SceneManager';
import { LevelManager } from '../levels/LevelManager';
import { WaterSortGame } from '../game/WaterSortGame';
import { HintSolver } from '../game/HintSolver';
import { EconomyManager } from '../game/EconomyManager';
import { HUD } from '../ui/HUD';
import { PauseModal } from '../ui/PauseModal';
import { WinDialog } from '../ui/WinDialog';
import { ParticleSystem } from '../effects/ParticleSystem';
import { LiquidStreamEffect } from '../effects/LiquidStreamEffect';
import { BottleAnimator } from '../effects/BottleAnimator';
import { AudioManager } from '../audio/AudioManager';
import { AnalyticsManager } from '../analytics/AnalyticsManager';
import type { Application } from 'pixi.js';

export class GameScene extends BaseScene {
  public readonly sceneName = 'GameScene';

  private levelManager: LevelManager;
  private game: WaterSortGame;
  private bottleRenderers: Map<number, BottleRenderer> = new Map();
  private originalPositions: Map<number, { x: number; y: number }> = new Map();

  private hud: HUD;
  private pauseModal: PauseModal | null = null;
  private winDialog: WinDialog | null = null;
  private particleSystem: ParticleSystem;
  private liquidStream: LiquidStreamEffect;

  private isAnimatingPour: boolean = false;
  private highlightedHintBottles: number[] = [];

  constructor() {
    super();
    this.levelManager = new LevelManager();
    this.game = new WaterSortGame();

    this.hud = new HUD({
      onUndo: () => this.handleUndo(),
      onRestart: () => this.handleRestart(),
      onPause: () => this.handlePause(),
      onHint: () => this.handleHint(),
    });

    this.particleSystem = new ParticleSystem();
    this.liquidStream = new LiquidStreamEffect();
  }

  public override async onInit(): Promise<void> {
    const container = ServiceContainer.getInstance();
    if (container.has('pixiApp')) {
      const app = container.get<Application>('pixiApp');
      TextureManager.getInstance().init(app);
    }

    this.addChild(this.liquidStream);
    this.addChild(this.particleSystem);
    this.addChild(this.hud);

    this.loadCurrentLevel();
  }

  private loadCurrentLevel(): void {
    this.closeWinDialog();
    this.closePauseModal();
    this.clearHintHighlights();

    this.bottleRenderers.forEach((renderer) => renderer.destroy());
    this.bottleRenderers.clear();
    this.originalPositions.clear();

    const levelConfig = this.levelManager.getCurrentLevelConfig();
    if (!levelConfig) return;

    this.game.initLevel(levelConfig.bottles);
    AnalyticsManager.getInstance().trackLevelStarted(levelConfig.levelNumber);

    this.hud.setLevel(levelConfig.levelNumber);
    this.hud.setMoves(0);
    this.hud.setCoins(EconomyManager.getInstance().getCoins());
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

    this.setChildIndex(this.liquidStream, this.children.length - 3);
    this.setChildIndex(this.particleSystem, this.children.length - 2);
    this.setChildIndex(this.hud, this.children.length - 1);

    this.onResize(window.innerWidth, window.innerHeight);
  }

  private async onBottleTapped(bottleId: number): Promise<void> {
    if (this.isAnimatingPour || this.pauseModal || this.winDialog) return;

    this.clearHintHighlights();

    const previousSelectedId = this.game.getSelectedBottleId();
    const response = this.game.selectBottle(bottleId);
    const currentSelectedId = this.game.getSelectedBottleId();

    if (response.action === 'selected' && currentSelectedId !== null) {
      AudioManager.getInstance().playSelect();
      const bottle = this.bottleRenderers.get(currentSelectedId);
      const orig = this.originalPositions.get(currentSelectedId);
      if (bottle && orig) {
        BottleAnimator.lift(bottle, orig.y);
      }
    }

    if (response.action === 'deselected' && previousSelectedId !== null) {
      const bottle = this.bottleRenderers.get(previousSelectedId);
      const orig = this.originalPositions.get(previousSelectedId);
      if (bottle && orig) {
        BottleAnimator.drop(bottle, orig.y);
      }
    }

    if (response.action === 'poured' && 'moveRecord' in response && response.moveRecord) {
      this.isAnimatingPour = true;
      AudioManager.getInstance().playPour();
      const record = response.moveRecord;
      const sourceBottle = this.bottleRenderers.get(record.fromBottleId);
      const targetBottle = this.bottleRenderers.get(record.toBottleId);
      const origPos = this.originalPositions.get(record.fromBottleId);

      if (sourceBottle && targetBottle && origPos) {
        await BottleAnimator.animatePour(
          sourceBottle,
          targetBottle,
          this.liquidStream,
          record.color,
          origPos.x,
          origPos.y
        );
      }

      this.isAnimatingPour = false;
      this.updateRenderState();

      if (this.game.checkIsWon()) {
        this.handleWin();
      }
    } else {
      this.updateRenderState();
    }
  }

  private handleHint(): void {
    if (this.isAnimatingPour || this.pauseModal || this.winDialog) return;

    const bestMove = HintSolver.findBestMove(this.game.getBottles());
    if (!bestMove) return;

    AnalyticsManager.getInstance().trackHintUsed(this.levelManager.getCurrentLevelNumber());
    this.clearHintHighlights();

    const source = this.bottleRenderers.get(bestMove.fromBottleId);
    const target = this.bottleRenderers.get(bestMove.toBottleId);

    if (source && target) {
      source.setSelected(true);
      target.setSelected(true);
      this.highlightedHintBottles = [bestMove.fromBottleId, bestMove.toBottleId];
    }
  }

  private clearHintHighlights(): void {
    this.highlightedHintBottles.forEach((id) => {
      const renderer = this.bottleRenderers.get(id);
      if (renderer && id !== this.game.getSelectedBottleId()) {
        renderer.setSelected(false);
      }
    });
    this.highlightedHintBottles = [];
  }

  private handleWin(): void {
    AudioManager.getInstance().playWin();
    const lvlNum = this.levelManager.getCurrentLevelNumber();
    const moves = this.game.getMoveCount();
    AnalyticsManager.getInstance().trackLevelCompleted(lvlNum, moves);

    this.particleSystem.spawnConfetti(70, window.innerWidth, window.innerHeight);

    setTimeout(() => {
      if (!this.winDialog) {
        const lvlNum = this.levelManager.getCurrentLevelNumber();
        const moves = this.game.getMoveCount();
        this.winDialog = new WinDialog(lvlNum, moves, {
          onNextLevel: () => {
            this.levelManager.completeCurrentLevel();
            this.loadCurrentLevel();
          },
          onLevelSelect: () => {
            const sceneMgr = ServiceContainer.getInstance().get<SceneManager>('sceneManager');
            sceneMgr.changeScene('LevelSelectScene');
          },
        });
        this.addChild(this.winDialog);
        this.winDialog.resize(window.innerWidth, window.innerHeight);
        this.hud.setCoins(EconomyManager.getInstance().getCoins());
      }
    }, 400);
  }

  private closeWinDialog(): void {
    if (this.winDialog) {
      this.removeChild(this.winDialog);
      this.winDialog.destroy();
      this.winDialog = null;
    }
  }

  private handleUndo(): void {
    if (this.isAnimatingPour || this.pauseModal || this.winDialog) return;
    this.clearHintHighlights();
    const undone = this.game.undo();
    if (undone) {
      AudioManager.getInstance().playUndo();
      AnalyticsManager.getInstance().trackUndoUsed(this.levelManager.getCurrentLevelNumber());
      this.updateRenderState();
    }
  }

  private handleRestart(): void {
    if (this.isAnimatingPour || this.pauseModal || this.winDialog) return;
    this.clearHintHighlights();
    const levelConfig = this.levelManager.getCurrentLevelConfig();
    if (levelConfig) {
      this.game.restart(levelConfig.bottles);
      this.updateRenderState();
    }
  }

  private handlePause(): void {
    if (this.isAnimatingPour || this.winDialog) return;
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
        const isHinted = this.highlightedHintBottles.includes(bottleModel.id);
        renderer.setSelected(bottleModel.id === selectedId || isHinted);
        renderer.setLiquidLayers([...bottleModel.getLayers()]);
      }
    }

    const moveCount = this.game.getMoveCount();
    this.hud.setMoves(moveCount);
    this.hud.setCoins(EconomyManager.getInstance().getCoins());
    this.hud.setUndoDisabled(moveCount === 0);
  }

  public override update(deltaTime: number): void {
    this.particleSystem.update(deltaTime);
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
    this.bottleRenderers.forEach((renderer, id) => {
      if (transforms[idx]) {
        const tf = transforms[idx];
        renderer.x = tf.x;
        renderer.y = tf.y;
        renderer.scale.set(tf.scale);
        this.originalPositions.set(id, { x: tf.x, y: tf.y });
      }
      idx++;
    });

    if (this.pauseModal) {
      this.pauseModal.resize(width, height);
    }

    if (this.winDialog) {
      this.winDialog.resize(width, height);
    }
  }

  public override async onExit(): Promise<void> {
    this.closeWinDialog();
    this.closePauseModal();
    this.particleSystem.clear();
    this.bottleRenderers.forEach((renderer) => renderer.destroy());
    this.bottleRenderers.clear();
    this.originalPositions.clear();
  }
}
