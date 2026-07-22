import gsap from 'gsap';

export class AnimationUtils {
  public static popIn(target: any, duration: number = 0.35, delay: number = 0): Promise<void> {
    return new Promise((resolve) => {
      target.scale.set(0);
      target.alpha = 0;
      gsap.to(target, {
        alpha: 1,
        duration,
        delay,
        ease: 'back.out(1.5)',
        onUpdate: () => {
          const progress = gsap.getProperty(target, 'alpha') as number;
          target.scale.set(progress);
        },
        onComplete: resolve,
      });
    });
  }

  public static popOut(target: any, duration: number = 0.25): Promise<void> {
    return new Promise((resolve) => {
      gsap.to(target, {
        alpha: 0,
        duration,
        ease: 'power2.in',
        onUpdate: () => {
          const alpha = target.alpha;
          target.scale.set(alpha);
        },
        onComplete: resolve,
      });
    });
  }

  public static lift(target: any, liftAmount: number = 25, duration: number = 0.2): Promise<void> {
    return new Promise((resolve) => {
      const startY = target.y;
      gsap.to(target, {
        y: startY - liftAmount,
        duration,
        ease: 'power2.out',
        onComplete: resolve,
      });
    });
  }

  public static drop(target: any, targetY: number, duration: number = 0.2): Promise<void> {
    return new Promise((resolve) => {
      gsap.to(target, {
        y: targetY,
        duration,
        ease: 'bounce.out',
        onComplete: resolve,
      });
    });
  }
}
