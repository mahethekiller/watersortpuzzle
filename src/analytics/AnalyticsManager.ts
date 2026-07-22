export interface AnalyticsEventParams {
  [key: string]: any;
}

export interface IAnalyticsProvider {
  logEvent(eventName: string, params?: AnalyticsEventParams): void;
}

export class ConsoleAnalyticsProvider implements IAnalyticsProvider {
  public logEvent(eventName: string, params?: AnalyticsEventParams): void {
    console.log(`[Analytics] Event: ${eventName}`, params || '');
  }
}

export class AnalyticsManager {
  private static instance: AnalyticsManager;
  private provider: IAnalyticsProvider;

  private constructor(provider?: IAnalyticsProvider) {
    this.provider = provider || new ConsoleAnalyticsProvider();
  }

  public static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  public setProvider(provider: IAnalyticsProvider): void {
    this.provider = provider;
  }

  public trackGameStarted(): void {
    this.provider.logEvent('game_started', { timestamp: Date.now() });
  }

  public trackLevelStarted(levelNumber: number): void {
    this.provider.logEvent('level_started', { level: levelNumber });
  }

  public trackLevelCompleted(levelNumber: number, movesCount: number): void {
    this.provider.logEvent('level_completed', { level: levelNumber, moves: movesCount });
  }

  public trackHintUsed(levelNumber: number): void {
    this.provider.logEvent('hint_used', { level: levelNumber });
  }

  public trackUndoUsed(levelNumber: number): void {
    this.provider.logEvent('undo_used', { level: levelNumber });
  }

  public trackRewardedWatched(rewardType: string): void {
    this.provider.logEvent('rewarded_watched', { reward: rewardType });
  }
}
