import { StorageManager } from '../core/StorageManager';
import { ServiceContainer } from '../core/ServiceContainer';

export class EconomyManager {
  private static instance: EconomyManager;
  private storageManager: StorageManager;

  private coins: number = 0;
  private stars: Map<number, number> = new Map();

  private constructor() {
    const container = ServiceContainer.getInstance();
    this.storageManager = container.has('storageManager')
      ? container.get<StorageManager>('storageManager')
      : new StorageManager();

    this.coins = this.storageManager.getItem<number>('player_coins', 100);
    const savedStars = this.storageManager.getItem<Record<string, number>>('level_stars', {});
    for (const key in savedStars) {
      this.stars.set(parseInt(key, 10), savedStars[key]);
    }
  }

  public static getInstance(): EconomyManager {
    if (!EconomyManager.instance) {
      EconomyManager.instance = new EconomyManager();
    }
    return EconomyManager.instance;
  }

  public getCoins(): number {
    return this.coins;
  }

  public addCoins(amount: number): number {
    if (amount <= 0) return this.coins;
    this.coins += amount;
    this.saveCoins();
    return this.coins;
  }

  public spendCoins(amount: number): boolean {
    if (amount <= 0 || this.coins < amount) {
      return false;
    }
    this.coins -= amount;
    this.saveCoins();
    return true;
  }

  public getStarsForLevel(levelNumber: number): number {
    return this.stars.get(levelNumber) || 0;
  }

  public setStarsForLevel(levelNumber: number, starsCount: number): void {
    const current = this.getStarsForLevel(levelNumber);
    if (starsCount > current) {
      this.stars.set(levelNumber, Math.min(3, Math.max(1, starsCount)));
      this.saveStars();
    }
  }

  private saveCoins(): void {
    this.storageManager.setItem('player_coins', this.coins);
  }

  private saveStars(): void {
    const obj: Record<string, number> = {};
    this.stars.forEach((val, key) => {
      obj[key.toString()] = val;
    });
    this.storageManager.setItem('level_stars', obj);
  }
}
