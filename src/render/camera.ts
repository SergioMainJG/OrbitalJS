export class Camera {
  public width: number;
  public height: number;
  public scale: number;
  private centerX: number;
  private centerY: number;

  constructor(width: number, height: number, initialScale: number = 100) {
    this.width = width;
    this.height = height;
    this.scale = initialScale;
    this.centerX = width / 2;
    this.centerY = height / 2;
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.centerX = width / 2;
    this.centerY = height / 2;
  }

  applyTransform(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.centerX, this.centerY);
    ctx.scale(this.scale, this.scale);
  }

  restore(ctx: CanvasRenderingContext2D): void {
    ctx.restore();
  }

  setScale(scale: number): void {
    this.scale = scale;
  }
}
