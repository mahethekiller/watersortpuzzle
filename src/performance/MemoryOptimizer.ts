import { Assets, Container } from 'pixi.js';

export class MemoryOptimizer {
  public static purgeContainer(container: Container): void {
    container.destroy({ children: true, texture: false });
  }

  public static purgeUnusedAssets(): void {
    try {
      Assets.unload({});
    } catch {
      // Fallback
    }
  }

  public static forceGarbageCollection(): void {
    if (typeof window !== 'undefined' && (window as any).gc) {
      try {
        (window as any).gc();
      } catch {
        // Normal browser GC behavior
      }
    }
  }
}
