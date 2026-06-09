/**
 * rAF-based animation loop that decouples physics updates from rendering.
 *
 * Calls `onUpdate(dt)` then `onRender()` on every frame. The wall-clock
 * delta is capped at 33 ms (~30 fps minimum) to avoid large physics jumps
 * when the tab is backgrounded or the frame rate drops.
 *
 * Respects `prefers-reduced-motion: reduce` (WCAG 2.1 §2.3):
 * when the user has requested reduced motion the loop runs at ~10 fps via
 * `setTimeout` instead of `requestAnimationFrame`, and the dt cap is raised
 * to 100 ms for numerical stability at the lower frame rate.
 */
export class AnimationLoop {
  private animationId: number | null = null;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private isRunning: boolean = false;
  private lastTimestamp: number = 0;
  /** True when the OS/browser prefers reduced motion */
  private prefersReduced: boolean = false;

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

    this.prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.isRunning = true;
    this.lastTimestamp = performance.now();

    if (this.prefersReduced) {
      this.loopReduced();
    } else {
      this.loop();
    }
  }

  /** Stops the loop and cancels the pending animation frame or timeout. */
  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
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

  /** Reduced-motion variant: runs at ~10 fps via setTimeout(100ms). */
  private loopReduced = (): void => {
    if (!this.isRunning) return;

    const now = performance.now();
    let dt = (now - this.lastTimestamp) / 1000;
    dt = Math.min(0.1, dt);
    this.lastTimestamp = now;

    this.onUpdate(dt);
    this.onRender();

    this.timeoutId = setTimeout(this.loopReduced, 100);
  };
}
