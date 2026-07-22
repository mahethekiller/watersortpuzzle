import { LevelGenerator } from './LevelGenerator';
import type { LevelConfig } from './LevelData';
import { StorageManager } from '../core/StorageManager';
import { ServiceContainer } from '../core/ServiceContainer';

export class DailyChallengeManager {
  private static instance: DailyChallengeManager;
  private storageManager: StorageManager;

  private constructor() {
    const container = ServiceContainer.getInstance();
    this.storageManager = container.has('storageManager')
      ? container.get<StorageManager>('storageManager')
      : new StorageManager();
  }

  public static getInstance(): DailyChallengeManager {
    if (!DailyChallengeManager.instance) {
      DailyChallengeManager.instance = new DailyChallengeManager();
    }
    return DailyChallengeManager.instance;
  }

  public getTodayDateString(): string {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  public getDailyLevelConfig(): LevelConfig {
    const dateStr = this.getTodayDateString();
    const seed = this.hashString(dateStr);
    return LevelGenerator.generateLevel({
      levelNumber: 999,
      colorCount: 6,
      capacity: 4,
      emptyBottleCount: 2,
      seed,
    });
  }

  public isDailyChallengeCompleted(): boolean {
    const today = this.getTodayDateString();
    const lastCompleted = this.storageManager.getItem<string>('daily_completed_date', '');
    return lastCompleted === today;
  }

  public markDailyChallengeCompleted(): void {
    const today = this.getTodayDateString();
    this.storageManager.setItem('daily_completed_date', today);
  }
}
