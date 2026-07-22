import { CONFIG } from './Config';

export class StorageManager {
  private prefix: string;

  constructor(prefix: string = CONFIG.storagePrefix) {
    this.prefix = prefix;
  }

  public setItem<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
      return true;
    } catch (error) {
      console.warn(`[StorageManager] Failed to save key '${key}':`, error);
      return false;
    }
  }

  public getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[StorageManager] Failed to read key '${key}':`, error);
      return defaultValue;
    }
  }

  public removeItem(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.warn(`[StorageManager] Failed to remove key '${key}':`, error);
    }
  }

  public clearAll(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.warn('[StorageManager] Failed to clear items:', error);
    }
  }
}
