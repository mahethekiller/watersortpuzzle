export interface IPoolable {
  reset(): void;
  destroy(): void;
}

export class ObjectPool<T extends IPoolable> {
  private pool: T[] = [];
  private factory: () => T;
  private maxSize: number;

  constructor(factory: () => T, initialSize: number = 10, maxSize: number = 100) {
    this.factory = factory;
    this.maxSize = maxSize;

    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.factory());
    }
  }

  public get(): T {
    if (this.pool.length > 0) {
      const obj = this.pool.pop()!;
      obj.reset();
      return obj;
    }
    return this.factory();
  }

  public release(obj: T): void {
    if (this.pool.length < this.maxSize) {
      obj.reset();
      this.pool.push(obj);
    } else {
      obj.destroy();
    }
  }

  public clear(): void {
    this.pool.forEach((obj) => obj.destroy());
    this.pool = [];
  }

  public getPoolSize(): number {
    return this.pool.length;
  }
}
