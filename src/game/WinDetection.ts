import type { Bottle } from './Bottle';

export class WinDetection {
  public static checkWinCondition(bottles: Bottle[]): boolean {
    if (bottles.length === 0) return false;

    for (const bottle of bottles) {
      if (!bottle.isEmpty() && !bottle.isSingleColorFull()) {
        return false;
      }
    }

    return true;
  }
}
