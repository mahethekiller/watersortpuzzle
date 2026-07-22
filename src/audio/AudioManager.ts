import { SoundEffects } from './SoundEffects';
import { StorageManager } from '../core/StorageManager';
import { ServiceContainer } from '../core/ServiceContainer';

export class AudioManager {
  private static instance: AudioManager;
  private soundEffects: SoundEffects;
  private storageManager: StorageManager;

  private sfxEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private volume: number = 1.0;

  private constructor() {
    this.soundEffects = new SoundEffects();
    const container = ServiceContainer.getInstance();
    this.storageManager = container.has('storageManager')
      ? container.get<StorageManager>('storageManager')
      : new StorageManager();

    this.sfxEnabled = this.storageManager.getItem<boolean>('sfx_enabled', true);
    this.musicEnabled = this.storageManager.getItem<boolean>('music_enabled', true);
    this.volume = this.storageManager.getItem<number>('volume', 1.0);
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public playSelect(): void {
    if (this.sfxEnabled) {
      this.soundEffects.playSelectSound();
    }
  }

  public playPour(): void {
    if (this.sfxEnabled) {
      this.soundEffects.playPourSound();
    }
  }

  public playButtonClick(): void {
    if (this.sfxEnabled) {
      this.soundEffects.playButtonClick();
    }
  }

  public playWin(): void {
    if (this.sfxEnabled) {
      this.soundEffects.playWinSound();
    }
  }

  public playUndo(): void {
    if (this.sfxEnabled) {
      this.soundEffects.playUndoSound();
    }
  }

  public isSfxEnabled(): boolean {
    return this.sfxEnabled;
  }

  public setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
    this.storageManager.setItem('sfx_enabled', enabled);
  }

  public isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  public setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    this.storageManager.setItem('music_enabled', enabled);
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.storageManager.setItem('volume', this.volume);
  }
}
