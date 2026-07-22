export interface BottleTransform {
  x: number;
  y: number;
  scale: number;
  row: number;
  col: number;
}

export interface LayoutOptions {
  screenWidth: number;
  screenHeight: number;
  bottleCount: number;
  baseBottleWidth?: number;
  baseBottleHeight?: number;
  maxColsPerRow?: number;
  paddingX?: number;
  paddingY?: number;
}

export class ResponsiveLayout {
  public static calculateLayout(options: LayoutOptions): BottleTransform[] {
    const {
      screenWidth,
      screenHeight,
      bottleCount,
      baseBottleWidth = 80,
      baseBottleHeight = 240,
      maxColsPerRow = 5,
      paddingX = 24,
      paddingY = 40,
    } = options;

    if (bottleCount <= 0) return [];

    let numRows = 1;
    let numCols = bottleCount;

    if (bottleCount > maxColsPerRow) {
      numRows = Math.ceil(bottleCount / maxColsPerRow);
      numCols = Math.min(bottleCount, maxColsPerRow);
    }

    const availableWidth = screenWidth * 0.9;
    const availableHeight = screenHeight * 0.75;

    const rowWidthNeeded = numCols * baseBottleWidth + (numCols - 1) * paddingX;
    const colHeightNeeded = numRows * baseBottleHeight + (numRows - 1) * paddingY;

    const scaleX = availableWidth / rowWidthNeeded;
    const scaleY = availableHeight / colHeightNeeded;
    const scale = Math.min(scaleX, scaleY, 1.2);

    const scaledBottleWidth = baseBottleWidth * scale;
    const scaledBottleHeight = baseBottleHeight * scale;
    const scaledPaddingX = paddingX * scale;
    const scaledPaddingY = paddingY * scale;

    const totalGridHeight = numRows * scaledBottleHeight + (numRows - 1) * scaledPaddingY;
    const startY = (screenHeight - totalGridHeight) / 2;

    const transforms: BottleTransform[] = [];

    let currentIndex = 0;
    for (let r = 0; r < numRows; r++) {
      const itemsInThisRow = Math.min(bottleCount - currentIndex, maxColsPerRow);
      const rowWidth = itemsInThisRow * scaledBottleWidth + (itemsInThisRow - 1) * scaledPaddingX;
      const startX = (screenWidth - rowWidth) / 2;

      for (let c = 0; c < itemsInThisRow; c++) {
        const x = startX + c * (scaledBottleWidth + scaledPaddingX);
        const y = startY + r * (scaledBottleHeight + scaledPaddingY);

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
