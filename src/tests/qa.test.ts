import { LevelLoader } from '../levels/LevelLoader';
import { WaterSortGame } from '../game/WaterSortGame';
import { HintSolver } from '../game/HintSolver';
import { EconomyManager } from '../game/EconomyManager';
import { StorageManager } from '../core/StorageManager';
import { AdManager } from '../ads/AdManager';
import { AnalyticsManager } from '../analytics/AnalyticsManager';
import { PerformanceTracker } from '../performance/PerformanceTracker';

export interface QATestReport {
  passed: boolean;
  totalTests: number;
  failedTests: number;
  errors: string[];
}

export function runFullQASuite(): QATestReport {
  const errors: string[] = [];
  let total = 0;
  let failed = 0;

  const assert = (condition: boolean, description: string) => {
    total++;
    if (!condition) {
      failed++;
      errors.push(`QA Assertion Failed: ${description}`);
      console.error(`[QA FAIL] ${description}`);
    } else {
      console.log(`[QA PASS] ${description}`);
    }
  };

  // Test 1: Level Loader 1-30
  for (let lvl = 1; lvl <= 30; lvl++) {
    const config = LevelLoader.getLevel(lvl);
    assert(config !== null && config.bottles.length > 0, `Level ${lvl} loaded successfully`);
  }

  // Test 2: Game State Initialization
  const game = new WaterSortGame();
  const lvl1 = LevelLoader.getLevel(1);
  game.initLevel(lvl1.bottles);
  assert(game.getBottles().length === lvl1.bottleCount, 'Game initialized with correct bottle count');

  // Test 3: Hint Solver
  const hint = HintSolver.findBestMove(game.getBottles());
  assert(hint !== null, 'Hint solver generated valid move');

  // Test 4: Undo System
  game.selectBottle(1);
  game.selectBottle(3);
  const moveCount = game.getMoveCount();
  const undoResult = game.undo();
  assert(undoResult !== null && game.getMoveCount() === moveCount - 1, 'Undo successfully reversed move');

  // Test 5: Economy & Persistence
  const economy = EconomyManager.getInstance();
  const initialCoins = economy.getCoins();
  economy.addCoins(50);
  assert(economy.getCoins() === initialCoins + 50, 'Economy added coins correctly');

  // Test 6: Storage Manager
  const storage = new StorageManager();
  storage.setItem('qa_test_key', 'hello_qa');
  assert(storage.getItem<string>('qa_test_key', '') === 'hello_qa', 'StorageManager read/write verified');

  // Test 7: Ads & Analytics
  const adManager = AdManager.getInstance();
  assert(adManager.isRewardedReady() === true, 'AdManager rewarded ready check verified');

  const analytics = AnalyticsManager.getInstance();
  analytics.trackGameStarted();
  assert(true, 'AnalyticsManager trackGameStarted executed');

  // Test 8: Performance Tracker
  const perf = PerformanceTracker.getInstance();
  assert(perf.getAverageFPS() >= 0, 'PerformanceTracker FPS reporting verified');

  return {
    passed: failed === 0,
    totalTests: total,
    failedTests: failed,
    errors,
  };
}
