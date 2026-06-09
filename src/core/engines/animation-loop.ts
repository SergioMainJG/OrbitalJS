/**
 * rAF-based animation loop that decouples physics updates from rendering.
 *
 * Calls `onUpdate(dt)` then `onRender()` on every frame. The wall-clock
 * delta is capped at 33 ms (~30 fps minimum) to avoid large physics jumps
 * when the tab is backgrounded or the frame rate drops.
 */
export class AnimationLoop {
  private animationId: number | null = null;
  private isRunning: boolean = false;
  private lastTimestamp: number = 0;

  /**
   * @param onUpdate - Physics callback. Receives wall-clock `dt` in seconds.
   * @param onRender - Render callback. Called immediately after `onUpdate`.
   */
  constructor(
    private onUpdate: (dt: number) => void,
    private onRender: () => void,
  ) {}

  /** Starts the loop. No-op if already running. */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.loop();
  }

  /** Stops the loop and cancels the pending animation frame. */
  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isRunning = false;
  }

  private loop = (): void => {
    if (!this.isRunning) return;

    const now = performance.now();
    let dt = (now - this.lastTimestamp) / 1000;
    dt = Math.min(0.033, dt);
    this.lastTimestamp = now;

    this.animationId = requestAnimationFrame(this.loop);

    this.onUpdate(dt);
    this.onRender();
  };
}
