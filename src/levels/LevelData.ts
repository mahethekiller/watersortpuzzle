export interface LevelBottleLayerData {
  color: number;
  amount: number;
}

export interface LevelBottleData {
  id: number;
  layers: LevelBottleLayerData[];
}

export interface LevelConfig {
  levelNumber: number;
  bottleCount: number;
  capacity: number;
  bottles: LevelBottleData[];
}
