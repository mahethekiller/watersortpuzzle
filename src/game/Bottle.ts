import type { LiquidLayer } from './LiquidLayer';

export class Bottle {
  public readonly id: number;
  public readonly capacity: number;
  private layers: LiquidLayer[] = [];

  constructor(id: number, capacity: number = 4, initialLayers: LiquidLayer[] = []) {
    this.id = id;
    this.capacity = capacity;
    this.layers = initialLayers.map((l) => ({ ...l }));
  }

  public getLayers(): ReadonlyArray<LiquidLayer> {
    return this.layers;
  }

  public getTotalAmount(): number {
    return this.layers.reduce((sum, layer) => sum + layer.amount, 0);
  }

  public getSpaceRemaining(): number {
    return this.capacity - this.getTotalAmount();
  }

  public isEmpty(): boolean {
    return this.layers.length === 0;
  }

  public isFull(): boolean {
    return this.getTotalAmount() >= this.capacity;
  }

  public isSingleColorFull(): boolean {
    if (!this.isFull() || this.layers.length !== 1) return false;
    return this.layers[0].amount === this.capacity;
  }

  public getTopLayer(): LiquidLayer | null {
    if (this.isEmpty()) return null;
    return this.layers[this.layers.length - 1];
  }

  public getTopColor(): number | null {
    const top = this.getTopLayer();
    return top ? top.color : null;
  }

  public getTopAmount(): number {
    const top = this.getTopLayer();
    return top ? top.amount : 0;
  }

  public addLiquid(color: number, amount: number): boolean {
    if (amount <= 0 || this.getSpaceRemaining() < amount) {
      return false;
    }
    const top = this.getTopLayer();
    if (top && top.color === color) {
      top.amount += amount;
    } else {
      this.layers.push({ color, amount });
    }
    return true;
  }

  public removeTopLiquid(amount: number): LiquidLayer | null {
    if (this.isEmpty() || amount <= 0) return null;
    const top = this.layers[this.layers.length - 1];
    const removedAmount = Math.min(amount, top.amount);
    top.amount -= removedAmount;

    if (top.amount === 0) {
      this.layers.pop();
    }

    return { color: top.color, amount: removedAmount };
  }

  public clone(): Bottle {
    return new Bottle(this.id, this.capacity, this.layers);
  }
}
