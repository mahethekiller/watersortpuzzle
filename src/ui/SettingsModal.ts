import { Container } from 'pixi.js';
import { ModalOverlay } from './ModalOverlay';
import { UIButton } from './UIButton';
import { StorageManager } from '../core/StorageManager';
import { ServiceContainer } from '../core/ServiceContainer';

export interface SettingsModalCallbacks {
  onClose?: () => void;
  onResetData?: () => void;
}

export class SettingsModal extends Container {
  private overlay: ModalOverlay;
  private sfxBtn: UIButton;
  private musicBtn: UIButton;
  private storageManager: StorageManager;

  private sfxEnabled: boolean = true;
  private musicEnabled: boolean = true;

  constructor(callbacks: SettingsModalCallbacks = {}) {
    super();

    const container = ServiceContainer.getInstance();
    this.storageManager = container.has('storageManager')
      ? container.get<StorageManager>('storageManager')
      : new StorageManager();

    this.sfxEnabled = this.storageManager.getItem<boolean>('sfx_enabled', true);
    this.musicEnabled = this.storageManager.getItem<boolean>('music_enabled', true);

    this.overlay = new ModalOverlay({
      title: 'Settings',
      width: 320,
      height: 340,
    });
    this.addChild(this.overlay);

    const card = this.overlay.getCardContainer();

    this.sfxBtn = new UIButton({
      label: `SFX: ${this.sfxEnabled ? 'ON' : 'OFF'}`,
      width: 240,
      height: 44,
      backgroundColor: this.sfxEnabled ? 0x22c55e : 0x64748b,
      onClick: () => this.toggleSfx(),
    });
    this.sfxBtn.x = (320 - 240) / 2;
    this.sfxBtn.y = 80;

    this.musicBtn = new UIButton({
      label: `Music: ${this.musicEnabled ? 'ON' : 'OFF'}`,
      width: 240,
      height: 44,
      backgroundColor: this.musicEnabled ? 0x22c55e : 0x64748b,
      onClick: () => this.toggleMusic(),
    });
    this.musicBtn.x = (320 - 240) / 2;
    this.musicBtn.y = 135;

    const resetBtn = new UIButton({
      label: 'Reset Progress',
      width: 240,
      height: 44,
      backgroundColor: 0xef4444,
      fontSize: 15,
      onClick: () => {
        this.storageManager.clearAll();
        if (callbacks.onResetData) callbacks.onResetData();
      },
    });
    resetBtn.x = (320 - 240) / 2;
    resetBtn.y = 190;

    const closeBtn = new UIButton({
      label: 'Close',
      width: 240,
      height: 44,
      backgroundColor: 0x475569,
      fontSize: 15,
      onClick: callbacks.onClose,
    });
    closeBtn.x = (320 - 240) / 2;
    closeBtn.y = 245;

    card.addChild(this.sfxBtn);
    card.addChild(this.musicBtn);
    card.addChild(resetBtn);
    card.addChild(closeBtn);
  }

  private toggleSfx(): void {
    this.sfxEnabled = !this.sfxEnabled;
    this.storageManager.setItem('sfx_enabled', this.sfxEnabled);
  }

  private toggleMusic(): void {
    this.musicEnabled = !this.musicEnabled;
    this.storageManager.setItem('music_enabled', this.musicEnabled);
  }

  public resize(width: number, height: number): void {
    this.overlay.resize(width, height);
  }
}
