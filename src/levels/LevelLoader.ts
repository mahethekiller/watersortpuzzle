import type { LevelConfig } from './LevelData';
import levelsData from './levels.json';

export class LevelLoader {
  private static levels: LevelConfig[] = levelsData as LevelConfig[];

  public static getLevel(levelNumber: number): LevelConfig | null {
    const level = this.levels.find((l) => l.levelNumber === levelNumber);
    return level ? JSON.parse(JSON.stringify(level)) as LevelConfig : null;
  }

  public static getTotalLevels(): number {
    return this.levels.length;
  }
}
