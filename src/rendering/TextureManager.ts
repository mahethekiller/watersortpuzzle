import { Application, Graphics, RenderTexture, Texture } from 'pixi.js';

export interface TexturePalette {
  glassBorder: number;
  glassFill: number;
  glassHighlight: number;
}

export class TextureManager {
  private static instance: TextureManager;
  private textures: Map<string, Texture> = new Map();
  private app: Application | null = null;

  private constructor() {}

  public static getInstance(): TextureManager {
    if (!TextureManager.instance) {
      TextureManager.instance = new TextureManager();
    }
    return TextureManager.instance;
  }

  public init(app: Application): void {
    this.app = app;
    this.generateDefaultTextures();
  }

  private generateDefaultTextures(): void {
    if (!this.app) return;

    // Generate procedural bottle highlight texture
    const highlightGpu = new Graphics();
    highlightGpu.ellipse(15, 60, 6, 45);
    highlightGpu.fill({ color: 0xffffff, alpha: 0.25 });

    const renderTexture = RenderTexture.create({ width: 30, height: 120 });
    this.app.renderer.render({ target: renderTexture, container: highlightGpu });
    this.textures.set('bottle_highlight', renderTexture);
    highlightGpu.destroy();
  }

  public getTexture(key: string): Texture | undefined {
    return this.textures.get(key);
  }

  public registerTexture(key: string, texture: Texture): void {
    this.textures.set(key, texture);
  }

  public destroy(): void {
    this.textures.forEach((texture) => texture.destroy(true));
    this.textures.clear();
  }
}
