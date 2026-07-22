import { Container } from 'pixi.js';

export abstract class BaseScene extends Container {
  public abstract readonly sceneName: string;

  public async onInit(): Promise<void> {}
  public async onEnter(): Promise<void> {}
  public update(_deltaTime: number): void {}
  public onResize(_width: number, _height: number): void {}
  public async onExit(): Promise<void> {}

  public override destroy(): void {
    super.destroy({ children: true });
  }
}
