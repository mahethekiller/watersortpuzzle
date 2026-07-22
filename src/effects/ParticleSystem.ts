import { Container, Graphics } from 'pixi.js';

interface Particle {
  graphics: Graphics;
  vx: number;
  vy: number;
  rotationSpeed: number;
  alphaSpeed: number;
}

export class ParticleSystem extends Container {
  private particles: Particle[] = [];
  private isEmitting: boolean = false;

  public spawnConfetti(count: number = 60, screenWidth: number = 360, screenHeight: number = 640): void {
    const colors = [0xef4444, 0x3b82f6, 0x22c55e, 0xeab308, 0xa855f7, 0xf97316, 0x06b6d4, 0xec4899];

    for (let i = 0; i < count; i++) {
      const g = new Graphics();
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 8 + 6;

      g.rect(-size / 2, -size / 2, size, size);
      g.fill({ color });

      g.x = screenWidth / 2 + (Math.random() - 0.5) * 100;
      g.y = screenHeight * 0.4 + (Math.random() - 0.5) * 50;

      this.addChild(g);

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;

      this.particles.push({
        graphics: g,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        alphaSpeed: Math.random() * 0.015 + 0.005,
      });
    }

    this.isEmitting = true;
  }

  public update(_deltaTime: number): void {
    if (!this.isEmitting || this.particles.length === 0) return;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.graphics.x += p.vx;
      p.graphics.y += p.vy;
      p.vy += 0.25;
      p.graphics.rotation += p.rotationSpeed;
      p.graphics.alpha -= p.alphaSpeed;

      if (p.graphics.alpha <= 0) {
        this.removeChild(p.graphics);
        p.graphics.destroy();
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length === 0) {
      this.isEmitting = false;
    }
  }

  public clear(): void {
    this.particles.forEach((p) => {
      this.removeChild(p.graphics);
      p.graphics.destroy();
    });
    this.particles = [];
    this.isEmitting = false;
  }
}
