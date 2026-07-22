import { Assets } from 'pixi.js';
import type { AssetsManifest } from 'pixi.js';

export class AssetLoader {
  private isInitialized: boolean = false;

  public async init(manifest?: AssetsManifest): Promise<void> {
    if (this.isInitialized) return;
    await Assets.init({ manifest });
    this.isInitialized = true;
  }

  public async loadBundle(
    bundleId: string,
    onProgress?: (progress: number) => void
  ): Promise<Record<string, any>> {
    return await Assets.loadBundle(bundleId, onProgress);
  }

  public async load<T = any>(key: string): Promise<T> {
    return await Assets.load<T>(key);
  }

  public get<T = any>(key: string): T {
    return Assets.get<T>(key);
  }

  public async unload(key: string): Promise<void> {
    await Assets.unload(key);
  }
}
