import { Ticker } from 'pixi.js';
import { PerformanceTracker } from '../performance/PerformanceTracker';

export type UpdateCallback = (deltaTime: number) => void;

export class GameLoop {
  private ticker: Ticker;
  private updateCallbacks: Set<UpdateCallback> = new Set();

  constructor(ticker: Ticker) {
    this.ticker = ticker;
    this.ticker.add(this.tick);
  }

  private tick = (ticker: Ticker): void => {
    PerformanceTracker.getInstance().update();
    const deltaTime = ticker.deltaTime;
    this.updateCallbacks.forEach((cb) => cb(deltaTime));
  };

  public addUpdateListener(callback: UpdateCallback): void {
    this.updateCallbacks.add(callback);
  }

  public removeUpdateListener(callback: UpdateCallback): void {
    this.updateCallbacks.delete(callback);
  }

  public start(): void {
    if (!this.ticker.started) {
      this.ticker.start();
    }
  }

  public stop(): void {
    if (this.ticker.started) {
      this.ticker.stop();
    }
  }

  public get FPS(): number {
    return this.ticker.FPS;
  }
}
