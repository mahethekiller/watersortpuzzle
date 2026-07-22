import { Bottle } from '../game/Bottle';
import { MoveValidator } from '../game/MoveValidator';
import { WinDetection } from '../game/WinDetection';
import { WaterSortGame } from '../game/WaterSortGame';

export function runGameplayTests(): boolean {
  try {
    // Test 1: Bottle creation & Liquid management
    const b1 = new Bottle(1, 4, [{ color: 0xff0000, amount: 2 }]);
    if (b1.getTopAmount() !== 2 || b1.getTopColor() !== 0xff0000 || b1.getSpaceRemaining() !== 2) {
      throw new Error('Bottle initialization test failed');
    }

    // Test 2: Valid move validation
    const b2 = new Bottle(2, 4, [{ color: 0xff0000, amount: 1 }]);
    const val1 = MoveValidator.validateMove(b1, b2);
    if (!val1.valid || val1.amountPoured !== 2) {
      throw new Error('Valid move validation test failed');
    }

    // Test 3: Invalid move (mismatched colors)
    const b3 = new Bottle(3, 4, [{ color: 0x00ff00, amount: 2 }]);
    const val2 = MoveValidator.validateMove(b1, b3);
    if (val2.valid) {
      throw new Error('Color mismatch validation test failed');
    }

    // Test 4: Game execution & Undo
    const game = new WaterSortGame();
    game.initLevel([
      { id: 1, capacity: 4, layers: [{ color: 0x0000ff, amount: 2 }] },
      { id: 2, capacity: 4, layers: [{ color: 0x0000ff, amount: 1 }] },
    ]);

    const sel1 = game.selectBottle(1);
    if (sel1.action !== 'selected') {
      throw new Error('Bottle selection test failed');
    }

    const pour1 = game.selectBottle(2);
    if (pour1.action !== 'poured' || game.getMoveCount() !== 1) {
      throw new Error('Pour execution test failed');
    }

    const undone = game.undo();
    if (!undone || game.getMoveCount() !== 0) {
      throw new Error('Undo operation test failed');
    }

    // Test 5: Win Detection
    const winGame = new WaterSortGame();
    winGame.initLevel([
      { id: 1, capacity: 4, layers: [{ color: 0xff0000, amount: 4 }] },
      { id: 2, capacity: 4, layers: [] },
    ]);
    if (!WinDetection.checkWinCondition(winGame.getBottles() as Bottle[])) {
      throw new Error('Win detection test failed');
    }

    return true;
  } catch (error) {
    console.error('[Gameplay Domain Test Error]:', error);
    return false;
  }
}
