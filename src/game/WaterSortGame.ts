import { Bottle } from './Bottle';
import { PourLogic } from './PourLogic';
import type { MoveRecord } from './PourLogic';
import { MoveValidator } from './MoveValidator';
import type { MoveValidationResult } from './MoveValidator';
import { UndoManager } from './UndoManager';
import { WinDetection } from './WinDetection';
import type { LiquidLayer } from './LiquidLayer';

export interface GameStateSnapshot {
  bottles: { id: number; capacity: number; layers: LiquidLayer[] }[];
  moveCount: number;
  isWon: boolean;
  selectedBottleId: number | null;
}

export type SelectionResponse =
  | { action: 'selected' | 'deselected' | 'invalid' }
  | { action: 'poured'; moveRecord: MoveRecord };

export class WaterSortGame {
  private bottleMap: Map<number, Bottle> = new Map();
  private bottleList: Bottle[] = [];
  private undoManager: UndoManager = new UndoManager();
  private selectedBottleId: number | null = null;
  private isWon: boolean = false;

  public initLevel(bottleConfigs: { id: number; capacity?: number; layers: LiquidLayer[] }[]): void {
    this.bottleMap.clear();
    this.bottleList = [];
    this.undoManager.clear();
    this.selectedBottleId = null;
    this.isWon = false;

    for (const config of bottleConfigs) {
      const bottle = new Bottle(config.id, config.capacity || 4, config.layers);
      this.bottleMap.set(config.id, bottle);
      this.bottleList.push(bottle);
    }
  }

  public selectBottle(bottleId: number): SelectionResponse {
    if (this.isWon) return { action: 'invalid' };

    const clickedBottle = this.bottleMap.get(bottleId);
    if (!clickedBottle) return { action: 'invalid' };

    if (this.selectedBottleId === null) {
      if (clickedBottle.isEmpty()) {
        return { action: 'invalid' };
      }
      this.selectedBottleId = bottleId;
      return { action: 'selected' };
    }

    if (this.selectedBottleId === bottleId) {
      this.selectedBottleId = null;
      return { action: 'deselected' };
    }

    const sourceBottle = this.bottleMap.get(this.selectedBottleId)!;
    const moveRecord = PourLogic.executePour(sourceBottle, clickedBottle);

    if (moveRecord) {
      this.undoManager.pushMove(moveRecord);
      this.selectedBottleId = null;
      this.isWon = WinDetection.checkWinCondition(this.bottleList);
      return { action: 'poured', moveRecord };
    }

    if (!clickedBottle.isEmpty()) {
      this.selectedBottleId = bottleId;
      return { action: 'selected' };
    }

    this.selectedBottleId = null;
    return { action: 'deselected' };
  }

  public undo(): MoveRecord | null {
    if (!this.undoManager.canUndo() || this.isWon) return null;
    const undoneMove = this.undoManager.undoLastMove(this.bottleMap);
    if (undoneMove) {
      this.selectedBottleId = null;
      this.isWon = WinDetection.checkWinCondition(this.bottleList);
    }
    return undoneMove;
  }

  public restart(initialConfigs: { id: number; capacity?: number; layers: LiquidLayer[] }[]): void {
    this.initLevel(initialConfigs);
  }

  public validateMove(fromBottleId: number, toBottleId: number): MoveValidationResult {
    const from = this.bottleMap.get(fromBottleId);
    const to = this.bottleMap.get(toBottleId);
    if (!from || !to) {
      return { valid: false, amountPoured: 0, reason: 'Bottle not found.' };
    }
    return MoveValidator.validateMove(from, to);
  }

  public getBottles(): ReadonlyArray<Bottle> {
    return this.bottleList;
  }

  public getSelectedBottleId(): number | null {
    return this.selectedBottleId;
  }

  public getMoveCount(): number {
    return this.undoManager.getMoveCount();
  }

  public checkIsWon(): boolean {
    return this.isWon;
  }

  public getSnapshot(): GameStateSnapshot {
    return {
      bottles: this.bottleList.map((b) => ({
        id: b.id,
        capacity: b.capacity,
        layers: b.getLayers().map((l) => ({ ...l })),
      })),
      moveCount: this.getMoveCount(),
      isWon: this.isWon,
      selectedBottleId: this.selectedBottleId,
    };
  }
}
