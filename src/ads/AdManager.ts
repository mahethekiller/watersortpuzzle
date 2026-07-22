export type AdType = 'interstitial' | 'rewarded' | 'banner';

export interface AdReward {
  type: string;
  amount: number;
}

export interface AdCallbacks {
  onAdLoaded?: (adType: AdType) => void;
  onAdOpened?: (adType: AdType) => void;
  onAdClosed?: (adType: AdType) => void;
  onAdRewarded?: (reward: AdReward) => void;
  onAdFailed?: (adType: AdType, error: string) => void;
}

export interface IAdProvider {
  init(): Promise<void>;
  isInterstitialReady(): boolean;
  showInterstitial(callbacks?: AdCallbacks): Promise<boolean>;
  isRewardedReady(): boolean;
  showRewarded(rewardType: string, rewardAmount: number, callbacks?: AdCallbacks): Promise<boolean>;
}

export class StubAdProvider implements IAdProvider {
  private isLoaded: boolean = true;

  public async init(): Promise<void> {
    console.log('[AdManager] StubAdProvider initialized (No native SDK).');
  }

  public isInterstitialReady(): boolean {
    return this.isLoaded;
  }

  public async showInterstitial(callbacks?: AdCallbacks): Promise<boolean> {
    console.log('[AdManager] Showing stub Interstitial ad...');
    if (callbacks?.onAdOpened) callbacks.onAdOpened('interstitial');

    await new Promise((r) => setTimeout(r, 200));

    if (callbacks?.onAdClosed) callbacks.onAdClosed('interstitial');
    return true;
  }

  public isRewardedReady(): boolean {
    return this.isLoaded;
  }

  public async showRewarded(
    rewardType: string = 'coins',
    rewardAmount: number = 50,
    callbacks?: AdCallbacks
  ): Promise<boolean> {
    console.log(`[AdManager] Showing stub Rewarded ad for ${rewardAmount} ${rewardType}...`);
    if (callbacks?.onAdOpened) callbacks.onAdOpened('rewarded');

    await new Promise((r) => setTimeout(r, 300));

    if (callbacks?.onAdRewarded) {
      callbacks.onAdRewarded({ type: rewardType, amount: rewardAmount });
    }
    if (callbacks?.onAdClosed) callbacks.onAdClosed('rewarded');
    return true;
  }
}

export class AdManager {
  private static instance: AdManager;
  private provider: IAdProvider;

  private constructor(provider?: IAdProvider) {
    this.provider = provider || new StubAdProvider();
  }

  public static getInstance(): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager();
    }
    return AdManager.instance;
  }

  public async init(): Promise<void> {
    await this.provider.init();
  }

  public setProvider(provider: IAdProvider): void {
    this.provider = provider;
  }

  public isInterstitialReady(): boolean {
    return this.provider.isInterstitialReady();
  }

  public async showInterstitial(callbacks?: AdCallbacks): Promise<boolean> {
    return await this.provider.showInterstitial(callbacks);
  }

  public isRewardedReady(): boolean {
    return this.provider.isRewardedReady();
  }

  public async showRewarded(
    rewardType: string = 'coins',
    rewardAmount: number = 50,
    callbacks?: AdCallbacks
  ): Promise<boolean> {
    return await this.provider.showRewarded(rewardType, rewardAmount, callbacks);
  }
}
