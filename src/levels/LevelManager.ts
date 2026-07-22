import { LevelLoader } from './LevelLoader';
import type { LevelConfig } from './LevelData';
import { StorageManager } from '../core/StorageManager';
import { ServiceContainer } from '../core/ServiceContainer';

export class LevelManager {
  private currentLevelNumber: number = 1;
  private maxUnlockedLevel: number = 1;
  private storageManager: StorageManager;

  constructor() {
    const container = ServiceContainer.getInstance();
    this.storageManager = container.has('storageManager')
      ? container.get<StorageManager>('storageManager')
      : new StorageManager();

    this.loadProgress();
  }

  private loadProgress(): void {
    this.currentLevelNumber = this.storageManager.getItem<number>('current_level', 1);
    this.maxUnlockedLevel = this.storageManager.getItem<number>('max_level', 1);
  }

  public saveProgress(): void {
    this.storageManager.setItem<number>('current_level', this.currentLevelNumber);
    this.storageManager.setItem<number>('max_level', this.maxUnlockedLevel);
  }

  public getCurrentLevelConfig(): LevelConfig | null {
    return LevelLoader.getLevel(this.currentLevelNumber);
  }

  public getLevelConfig(levelNumber: number): LevelConfig | null {
    return LevelLoader.getLevel(levelNumber);
  }

  public setCurrentLevel(levelNumber: number): boolean {
    if (levelNumber < 1 || levelNumber > LevelLoader.getTotalLevels()) {
      return false;
    }
    this.currentLevelNumber = levelNumber;
    if (levelNumber > this.maxUnlockedLevel) {
      this.maxUnlockedLevel = levelNumber;
    }
    this.saveProgress();
    return true;
  }

  public completeCurrentLevel(): boolean {
    const nextLevel = this.currentLevelNumber + 1;
    if (nextLevel <= LevelLoader.getTotalLevels()) {
      this.currentLevelNumber = nextLevel;
      if (nextLevel > this.maxUnlockedLevel) {
        this.maxUnlockedLevel = nextLevel;
      }
      this.saveProgress();
      return true;
    }
    this.saveProgress();
    return false;
  }

  public getCurrentLevelNumber(): number {
    return this.currentLevelNumber;
  }

  public getMaxUnlockedLevel(): number {
    return this.maxUnlockedLevel;
  }

  public getTotalLevels(): number {
    return LevelLoader.getTotalLevels();
  }
}
