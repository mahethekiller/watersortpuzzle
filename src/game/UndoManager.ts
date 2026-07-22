import type { Bottle } from './Bottle';
import type { MoveRecord } from './PourLogic';

export class UndoManager {
  private history: MoveRecord[] = [];

  public pushMove(move: MoveRecord): void {
    this.history.push(move);
  }

  public popMove(): MoveRecord | null {
    return this.history.pop() || null;
  }

  public undoLastMove(bottles: Map<number, Bottle>): MoveRecord | null {
    const lastMove = this.popMove();
    if (!lastMove) return null;

    const fromBottle = bottles.get(lastMove.fromBottleId);
    const toBottle = bottles.get(lastMove.toBottleId);

    if (!fromBottle || !toBottle) return null;

    toBottle.removeTopLiquid(lastMove.amount);
    fromBottle.addLiquid(lastMove.color, lastMove.amount);

    return lastMove;
  }

  public canUndo(): boolean {
    return this.history.length > 0;
  }

  public getMoveCount(): number {
    return this.history.length;
  }

  public clear(): void {
    this.history = [];
  }
}
