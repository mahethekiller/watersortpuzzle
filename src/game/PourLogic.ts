import type { Bottle } from './Bottle';
import { MoveValidator } from './MoveValidator';
import type { MoveValidationResult } from './MoveValidator';

export interface MoveRecord {
  fromBottleId: number;
  toBottleId: number;
  color: number;
  amount: number;
}

export class PourLogic {
  public static executePour(fromBottle: Bottle, toBottle: Bottle): MoveRecord | null {
    const validation: MoveValidationResult = MoveValidator.validateMove(fromBottle, toBottle);
    if (!validation.valid || validation.amountPoured <= 0) {
      return null;
    }

    const color = fromBottle.getTopColor()!;
    const amountToPour = validation.amountPoured;

    fromBottle.removeTopLiquid(amountToPour);
    toBottle.addLiquid(color, amountToPour);

    return {
      fromBottleId: fromBottle.id,
      toBottleId: toBottle.id,
      color,
      amount: amountToPour,
    };
  }
}
