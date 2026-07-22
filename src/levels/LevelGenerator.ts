import type { LevelConfig, LevelBottleData } from './LevelData';

export interface LevelGeneratorOptions {
  levelNumber?: number;
  colorCount?: number;
  capacity?: number;
  emptyBottleCount?: number;
  shuffleSteps?: number;
  seed?: number;
}

export class LevelGenerator {
  private static readonly COLOR_PALETTE = [
    15680580,
    3900150,
    2278750,
    15381512,
    11032055,
    16347926,
    440020,
    15485081,
    8703000,
    1357990,
    6514417,
    14251782,
  ];

  public static generateLevel(options: LevelGeneratorOptions = {}): LevelConfig {
    const levelNumber = options.levelNumber || 100;
    const capacity = options.capacity || 4;
    const emptyCount = options.emptyBottleCount !== undefined ? options.emptyBottleCount : 2;
    const colorCount = options.colorCount || Math.min(10, Math.max(2, Math.floor(levelNumber / 3) + 2));
    const shuffleSteps = options.shuffleSteps || colorCount * 8;

    const colors = this.COLOR_PALETTE.slice(0, colorCount);
    const totalBottles = colorCount + emptyCount;

    const bottleStates: number[][] = [];
    for (let i = 0; i < colorCount; i++) {
      bottleStates.push(new Array(capacity).fill(colors[i]));
    }
    for (let i = 0; i < emptyCount; i++) {
      bottleStates.push([]);
    }

    let seed = options.seed || levelNumber * 12345 + 6789;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let step = 0; step < shuffleSteps; step++) {
      const fromIdx = Math.floor(random() * totalBottles);
      const toIdx = Math.floor(random() * totalBottles);

      if (fromIdx === toIdx) continue;

      const from = bottleStates[fromIdx];
      const to = bottleStates[toIdx];

      if (from.length > 0 && to.length < capacity) {
        const unit = from.pop()!;
        to.push(unit);
      }
    }

    const bottles: LevelBottleData[] = bottleStates.map((units, idx) => {
      const layers: Array<{ color: number; amount: number }> = [];
      for (const unitColor of units) {
        if (layers.length > 0 && layers[layers.length - 1].color === unitColor) {
          layers[layers.length - 1].amount++;
        } else {
          layers.push({ color: unitColor, amount: 1 });
        }
      }
      return { id: idx + 1, layers };
    });

    return {
      levelNumber,
      bottleCount: totalBottles,
      capacity,
      bottles,
    };
  }
}
