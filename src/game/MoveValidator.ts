import type { Bottle } from './Bottle';

export interface MoveValidationResult {
  valid: boolean;
  amountPoured: number;
  reason?: string;
}

export class MoveValidator {
  public static validateMove(fromBottle: Bottle, toBottle: Bottle): MoveValidationResult {
    if (fromBottle.id === toBottle.id) {
      return { valid: false, amountPoured: 0, reason: 'Source and target bottles are identical.' };
    }

    if (fromBottle.isEmpty()) {
      return { valid: false, amountPoured: 0, reason: 'Source bottle is empty.' };
    }

    if (toBottle.isFull()) {
      return { valid: false, amountPoured: 0, reason: 'Target bottle is full.' };
    }

    const fromColor = fromBottle.getTopColor();
    const toColor = toBottle.getTopColor();

    if (toColor !== null && toColor !== fromColor) {
      return { valid: false, amountPoured: 0, reason: 'Top liquid colors do not match.' };
    }

    const fromTopAmount = fromBottle.getTopAmount();
    const toSpace = toBottle.getSpaceRemaining();
    const amountPoured = Math.min(fromTopAmount, toSpace);

    if (amountPoured <= 0) {
      return { valid: false, amountPoured: 0, reason: 'No space remaining in target bottle.' };
    }

    return { valid: true, amountPoured };
  }
}
