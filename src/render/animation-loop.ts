export class AnimationLoop {
  private animationId: number | null = null;
  private isRunning: boolean = false;
  private lastTimestamp: number = 0;

  constructor(
    private onUpdate: (dt: number) => void,
    private onRender: () => void,
  ) {}

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.loop();
  }

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
