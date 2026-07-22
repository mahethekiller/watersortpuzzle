import type { Bottle } from './Bottle';
import { MoveValidator } from './MoveValidator';

export interface HintMove {
  fromBottleId: number;
  toBottleId: number;
}

export class HintSolver {
  public static findBestMove(bottles: ReadonlyArray<Bottle>): HintMove | null {
    let bestMove: HintMove | null = null;
    let highestPriority = -1;

    for (const fromBottle of bottles) {
      if (fromBottle.isEmpty()) continue;

      for (const toBottle of bottles) {
        if (fromBottle.id === toBottle.id) continue;

        const validation = MoveValidator.validateMove(fromBottle, toBottle);
        if (!validation.valid || validation.amountPoured <= 0) continue;

        let priority = 1;

        // Priority 3: Move completes a single-color bottle
        const simulatedToAmount = toBottle.getTotalAmount() + validation.amountPoured;
        if (simulatedToAmount === toBottle.capacity && (toBottle.isEmpty() || toBottle.getLayers().length === 1)) {
          priority = 3;
        }
        // Priority 2: Move into non-empty matching bottle
        else if (!toBottle.isEmpty()) {
          priority = 2;
        }

        if (priority > highestPriority) {
          highestPriority = priority;
          bestMove = { fromBottleId: fromBottle.id, toBottleId: toBottle.id };
        }
      }
    }

    return bestMove;
  }
}
