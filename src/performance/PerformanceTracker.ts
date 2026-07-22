export class PerformanceTracker {
  private static instance: PerformanceTracker;
  private fpsHistory: number[] = [];
  private currentFPS: number = 60;
  private lastTime: number = performance.now();

  private constructor() {}

  public static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  public update(): void {
    const now = performance.now();
    const delta = (now - this.lastTime) / 1000;
    this.lastTime = now;

    if (delta > 0) {
      this.currentFPS = Math.round(1 / delta);
      this.fpsHistory.push(this.currentFPS);
      if (this.fpsHistory.length > 60) {
        this.fpsHistory.shift();
      }
    }
  }

  public getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 60;
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.fpsHistory.length);
  }

  public getCurrentFPS(): number {
    return this.currentFPS;
  }
}
