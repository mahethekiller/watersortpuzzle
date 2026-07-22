import type { GameAreaLayoutInfo } from '../ui/LayoutManager';

export interface BottleTransform {
  x: number;
  y: number;
  scale: number;
  row: number;
  col: number;
}

export class ResponsiveLayout {
  public static calculateGameAreaLayout(
    gameAreaInfo: GameAreaLayoutInfo,
    bottleCount: number
  ): BottleTransform[] {
    if (bottleCount <= 0) return [];

    const { bounds, scale, bottleWidth, bottleHeight } = gameAreaInfo;

    let numRows = 1;
    let maxColsPerRow = bottleCount;

    if (bottleCount > 5) {
      numRows = 2;
      maxColsPerRow = Math.ceil(bottleCount / 2);
    }

    const gapX = Math.min(24 * scale, Math.floor(bounds.width * 0.035));
    const gapY = Math.min(36 * scale, Math.floor(bounds.height * 0.04));

    const totalGridHeight = numRows * bottleHeight + (numRows - 1) * gapY;
    const startY = bounds.y + (bounds.height - totalGridHeight) / 2;

    const transforms: BottleTransform[] = [];

    let currentIndex = 0;
    for (let r = 0; r < numRows; r++) {
      const itemsInThisRow = Math.min(bottleCount - currentIndex, maxColsPerRow);
      const rowWidth = itemsInThisRow * bottleWidth + (itemsInThisRow - 1) * gapX;
      const startX = bounds.x + (bounds.width - rowWidth) / 2;

      for (let c = 0; c < itemsInThisRow; c++) {
        const x = startX + c * (bottleWidth + gapX);
        const y = startY + r * (bottleHeight + gapY);

        transforms.push({
          x,
          y,
          scale,
          row: r,
          col: c,
        });

        currentIndex++;
      }
    }

    return transforms;
  }
}
