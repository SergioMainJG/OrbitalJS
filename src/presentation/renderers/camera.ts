export class Camera {
  public width: number;
  public height: number;
  public scale: number;
  public offsetX: number = 0;
  public offsetY: number = 0;
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

  autoScale(maxOrbitAU: number, padding: number = 1.25): void {
    this.scale = Math.min(this.width, this.height) / (maxOrbitAU * 2 * padding);
    this.offsetX = 0;
    this.offsetY = 0;
  }

  zoom(factor: number, mouseX?: number, mouseY?: number): void {
    const oldScale = this.scale;
    this.scale *= factor;
    this.scale = Math.max(0.5, Math.min(100000, this.scale));

    if (mouseX !== undefined && mouseY !== undefined) {
      const scaleRatio = this.scale / oldScale;
      const dx = mouseX - (this.centerX + this.offsetX);
      const dy = mouseY - (this.centerY + this.offsetY);
      this.offsetX -= (dx * (scaleRatio - 1)) / scaleRatio;
      this.offsetY -= (dy * (scaleRatio - 1)) / scaleRatio;
    }
  }

  pan(dx: number, dy: number): void {
    this.offsetX += dx;
    this.offsetY += dy;
  }

  getCenter(): { cx: number; cy: number } {
    return {
      cx: this.centerX + this.offsetX,
      cy: this.centerY + this.offsetY,
    };
  }

  applyTransform(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.centerX + this.offsetX, this.centerY + this.offsetY);
    ctx.scale(this.scale, this.scale);
  }

  restore(ctx: CanvasRenderingContext2D): void {
    ctx.restore();
  }

  setScale(scale: number): void {
    this.scale = scale;
  }
}
