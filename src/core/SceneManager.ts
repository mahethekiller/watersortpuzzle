import { Container } from 'pixi.js';
import { BaseScene } from '../scenes/BaseScene';

export class SceneManager {
  private stage: Container;
  private currentScene: BaseScene | null = null;
  private scenes: Map<string, new () => BaseScene> = new Map();

  constructor(stage: Container) {
    this.stage = stage;
  }

  public registerScene(name: string, sceneClass: new () => BaseScene): void {
    this.scenes.set(name, sceneClass);
  }

  public async changeScene(name: string): Promise<void> {
    const SceneClass = this.scenes.get(name);
    if (!SceneClass) {
      throw new Error(`Scene '${name}' is not registered in SceneManager.`);
    }

    if (this.currentScene) {
      await this.currentScene.onExit();
      this.stage.removeChild(this.currentScene);
      this.currentScene.destroy();
      this.currentScene = null;
    }

    const newScene = new SceneClass();
    await newScene.onInit();
    this.stage.addChild(newScene);
    this.currentScene = newScene;
    await newScene.onEnter();

    this.onResize(window.innerWidth, window.innerHeight);
  }

  public update(deltaTime: number): void {
    if (this.currentScene) {
      this.currentScene.update(deltaTime);
    }
  }

  public onResize(width: number, height: number): void {
    if (this.currentScene) {
      this.currentScene.onResize(width, height);
    }
  }

  public getCurrentScene(): BaseScene | null {
    return this.currentScene;
  }
}
