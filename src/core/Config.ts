export interface GameConfig {
  readonly title: string;
  readonly version: string;
  readonly width: number;
  readonly height: number;
  readonly targetFPS: number;
  readonly backgroundColor: number;
  readonly storagePrefix: string;
}

export const CONFIG: GameConfig = {
  title: 'Water Sort Puzzle',
  version: '1.0.0',
  width: 1080,
  height: 1920,
  targetFPS: 60,
  backgroundColor: 0x0f172a,
  storagePrefix: 'wsp_',
};
