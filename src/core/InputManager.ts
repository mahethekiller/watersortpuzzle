import { EventBus } from './EventBus';

export interface PointerPosition {
  x: number;
  y: number;
}

export class InputManager {
  private eventBus: EventBus;
  private isPointerDown: boolean = false;
  private lastPosition: PointerPosition = { x: 0, y: 0 };
  private targetElement: HTMLElement | Window | null = null;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  public init(targetElement: HTMLElement | Window = window): void {
    this.targetElement = targetElement;
    targetElement.addEventListener('pointerdown', this.onPointerDown as EventListener);
    targetElement.addEventListener('pointermove', this.onPointerMove as EventListener);
    targetElement.addEventListener('pointerup', this.onPointerUp as EventListener);
    targetElement.addEventListener('pointercancel', this.onPointerUp as EventListener);
    window.addEventListener('resize', this.onResize);
  }

  private onPointerDown = (event: PointerEvent): void => {
    this.isPointerDown = true;
    this.lastPosition = { x: event.clientX, y: event.clientY };
    this.eventBus.emit('input:pointerdown', { ...this.lastPosition });
  };

  private onPointerMove = (event: PointerEvent): void => {
    this.lastPosition = { x: event.clientX, y: event.clientY };
    this.eventBus.emit('input:pointermove', {
      position: { ...this.lastPosition },
      isDown: this.isPointerDown,
    });
  };

  private onPointerUp = (_event: PointerEvent): void => {
    if (this.isPointerDown) {
      this.isPointerDown = false;
      this.eventBus.emit('input:pointerup', { ...this.lastPosition });
    }
  };

  private onResize = (): void => {
    this.eventBus.emit('input:resize', {
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  public getPointerPosition(): PointerPosition {
    return { ...this.lastPosition };
  }

  public destroy(): void {
    if (this.targetElement) {
      this.targetElement.removeEventListener('pointerdown', this.onPointerDown as EventListener);
      this.targetElement.removeEventListener('pointermove', this.onPointerMove as EventListener);
      this.targetElement.removeEventListener('pointerup', this.onPointerUp as EventListener);
      this.targetElement.removeEventListener('pointercancel', this.onPointerUp as EventListener);
    }
    window.removeEventListener('resize', this.onResize);
  }
}
