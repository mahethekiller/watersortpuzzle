import type { LevelConfig } from './LevelData';
import { LevelGenerator } from './LevelGenerator';
import levelsData from './levels.json';

export class LevelLoader {
  private static levels: LevelConfig[] = levelsData as LevelConfig[];

  public static getLevel(levelNumber: number): LevelConfig {
    const predefined = this.levels.find((l) => l.levelNumber === levelNumber);
    if (predefined) {
      return JSON.parse(JSON.stringify(predefined)) as LevelConfig;
    }
    // Procedural level generation for level 21 and beyond (Infinite Levels)
    return LevelGenerator.generateLevel({ levelNumber });
  }

  public static getTotalLevels(): number {
    return 100; // Infinite / Extended level count
  }
}
