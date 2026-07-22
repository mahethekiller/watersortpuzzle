import { Application } from 'pixi.js';
import { CONFIG } from './Config';
import { EventBus } from './EventBus';
import { ServiceContainer } from './ServiceContainer';
import { StorageManager } from './StorageManager';
import { InputManager } from './InputManager';
import { AssetLoader } from './AssetLoader';
import { SceneManager } from './SceneManager';
import { GameLoop } from './GameLoop';
import { BootScene } from '../scenes/BootScene';
import { GameScene } from '../scenes/GameScene';
import { MainMenuScene } from '../scenes/MainMenuScene';
import { LevelSelectScene } from '../scenes/LevelSelectScene';

export class Game {
  private static instance: Game;
  private app: Application | null = null;
  private isInitialized: boolean = false;

  private constructor() {}

  public static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  public async init(containerElement: HTMLElement): Promise<void> {
    if (this.isInitialized) return;

    // Initialize PixiJS 8 Application
    const app = new Application();
    await app.init({
      resizeTo: window,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
      backgroundColor: CONFIG.backgroundColor,
      antialias: true,
    });

    this.app = app;
    containerElement.appendChild(app.canvas);

    // Dependency Injection & Core Managers Setup
    const container = ServiceContainer.getInstance();
    const eventBus = new EventBus();
    const storageManager = new StorageManager();
    const inputManager = new InputManager(eventBus);
    const assetLoader = new AssetLoader();
    const sceneManager = new SceneManager(app.stage);
    const gameLoop = new GameLoop(app.ticker);

    inputManager.init(app.canvas as HTMLElement);
    await assetLoader.init();

    // Register Services
    container.register('eventBus', eventBus);
    container.register('storageManager', storageManager);
    container.register('inputManager', inputManager);
    container.register('assetLoader', assetLoader);
    container.register('sceneManager', sceneManager);
    container.register('gameLoop', gameLoop);
    container.register('pixiApp', app);

    // Bind scene manager update to game loop
    gameLoop.addUpdateListener((deltaTime) => {
      sceneManager.update(deltaTime);
    });

    // Listen to resize events from input manager
    eventBus.on('input:resize', ({ width, height }: { width: number; height: number }) => {
      sceneManager.onResize(width, height);
    });

    // Register scenes and launch MainMenuScene
    sceneManager.registerScene('BootScene', BootScene);
    sceneManager.registerScene('GameScene', GameScene);
    sceneManager.registerScene('MainMenuScene', MainMenuScene);
    sceneManager.registerScene('LevelSelectScene', LevelSelectScene);
    await sceneManager.changeScene('MainMenuScene');

    this.isInitialized = true;
  }

  public getApp(): Application | null {
    return this.app;
  }
}
