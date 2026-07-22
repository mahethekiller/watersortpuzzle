export interface ViewportRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HeaderLayoutInfo {
  bounds: ViewportRect;
  levelBadgePos: { x: number; y: number; width: number; height: number };
  coinsBadgePos: { x: number; y: number; width: number; height: number };
  buttons: Array<{ id: string; x: number; y: number; width: number; height: number }>;
}

export interface GameAreaLayoutInfo {
  bounds: ViewportRect;
  bottleWidth: number;
  bottleHeight: number;
  scale: number;
  gridX: number;
  gridY: number;
}

export interface FooterLayoutInfo {
  bounds: ViewportRect;
}

export interface FullLayout {
  screenWidth: number;
  screenHeight: number;
  safeAreaInsetTop: number;
  safeAreaInsetBottom: number;
  header: HeaderLayoutInfo;
  gameArea: GameAreaLayoutInfo;
  footer: FooterLayoutInfo;
}

export class LayoutManager {
  private static instance: LayoutManager;

  public static getInstance(): LayoutManager {
    if (!LayoutManager.instance) {
      LayoutManager.instance = new LayoutManager();
    }
    return LayoutManager.instance;
  }

  public calculateLayout(
    screenWidth: number,
    screenHeight: number,
    bottleCount: number = 7
  ): FullLayout {
    // 1. Define Regions (Header 15%, Game Area 70%, Footer 15%)
    const safeTop = Math.max(12, Math.floor(screenHeight * 0.02));
    const safeBottom = Math.max(12, Math.floor(screenHeight * 0.02));

    const headerHeight = Math.floor(screenHeight * 0.15);
    const footerHeight = Math.floor(screenHeight * 0.15);
    const gameAreaHeight = screenHeight - headerHeight - footerHeight;

    const headerBounds: ViewportRect = {
      x: 0,
      y: safeTop,
      width: screenWidth,
      height: headerHeight - safeTop,
    };

    const gameAreaBounds: ViewportRect = {
      x: 0,
      y: headerHeight,
      width: screenWidth,
      height: gameAreaHeight,
    };

    const footerBounds: ViewportRect = {
      x: 0,
      y: screenHeight - footerHeight,
      width: screenWidth,
      height: footerHeight - safeBottom,
    };

    // 2. Calculate Header Elements
    const paddingX = Math.min(24, screenWidth * 0.04);
    const topRowY = headerBounds.y + 4;
    const topRowHeight = 36;

    const badgeW = Math.min(130, Math.floor(screenWidth * 0.32));

    const levelBadgePos = {
      x: paddingX,
      y: topRowY,
      width: badgeW,
      height: topRowHeight,
    };

    const coinsBadgePos = {
      x: screenWidth - paddingX - badgeW,
      y: topRowY,
      width: badgeW,
      height: topRowHeight,
    };

    // Row 2: Action Buttons (Hint, Undo, Restart, Pause)
    const buttonRowY = topRowY + topRowHeight + 8;
    const buttonRowHeight = Math.min(48, headerBounds.height - topRowHeight - 16);
    const buttonIds = ['hint', 'undo', 'restart', 'pause'];
    const numButtons = buttonIds.length;
    const totalBtnGap = Math.min(10, screenWidth * 0.02);
    const availableBtnWidth = screenWidth - paddingX * 2 - totalBtnGap * (numButtons - 1);
    const btnWidth = Math.min(85, Math.floor(availableBtnWidth / numButtons));

    const totalButtonsWidth = numButtons * btnWidth + (numButtons - 1) * totalBtnGap;
    const startBtnX = (screenWidth - totalButtonsWidth) / 2;

    const buttons = buttonIds.map((id, index) => ({
      id,
      x: startBtnX + index * (btnWidth + totalBtnGap),
      y: buttonRowY,
      width: btnWidth,
      height: buttonRowHeight,
    }));

    const header: HeaderLayoutInfo = {
      bounds: headerBounds,
      levelBadgePos,
      coinsBadgePos,
      buttons,
    };

    // 3. Calculate Game Area Bottle Dimensions & Grid
    let numRows = 1;
    let maxColsPerRow = bottleCount;

    if (bottleCount > 5) {
      numRows = 2;
      maxColsPerRow = Math.ceil(bottleCount / 2);
    }

    const maxGridW = gameAreaBounds.width * 0.92;
    const maxGridH = gameAreaBounds.height * 0.88;

    const baseWidth = 80;
    const baseHeight = 240;
    const gapX = Math.min(24, Math.floor(screenWidth * 0.035));
    const gapY = Math.min(40, Math.floor(gameAreaBounds.height * 0.05));

    const totalWidthNeeded = maxColsPerRow * baseWidth + (maxColsPerRow - 1) * gapX;
    const totalHeightNeeded = numRows * baseHeight + (numRows - 1) * gapY;

    const scaleX = maxGridW / totalWidthNeeded;
    const scaleY = maxGridH / totalHeightNeeded;
    const scale = Math.min(scaleX, scaleY, 1.4);

    const bottleWidth = baseWidth * scale;
    const bottleHeight = baseHeight * scale;

    const gridX = gameAreaBounds.x;
    const gridY = gameAreaBounds.y;

    const gameArea: GameAreaLayoutInfo = {
      bounds: gameAreaBounds,
      bottleWidth,
      bottleHeight,
      scale,
      gridX,
      gridY,
    };

    const footer: FooterLayoutInfo = {
      bounds: footerBounds,
    };

    return {
      screenWidth,
      screenHeight,
      safeAreaInsetTop: safeTop,
      safeAreaInsetBottom: safeBottom,
      header,
      gameArea,
      footer,
    };
  }
}
