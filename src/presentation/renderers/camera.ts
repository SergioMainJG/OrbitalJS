/**
 * 2-D camera for the Canvas renderer.
 *
 * Manages pan, zoom, and coordinate transforms between heliocentric AU space
 * and screen pixel space. The canvas origin is placed at the geometric center
 * of the viewport; `offsetX`/`offsetY` track cumulative pan.
 */
export class Camera {
  /** Viewport width in CSS pixels. */
  public width: number;
  /** Viewport height in CSS pixels. */
  public height: number;
  /** Current zoom level in px/AU. */
  public scale: number;
  /** Cumulative pan X offset in pixels (positive = panning right). */
  public offsetX: number = 0;
  /** Cumulative pan Y offset in pixels (positive = panning down). */
  public offsetY: number = 0;
  private centerX: number;
  private centerY: number;

  /**
   * @param width        - Initial viewport width in pixels.
   * @param height       - Initial viewport height in pixels.
   * @param initialScale - Starting zoom level in px/AU (default `100`).
   */
  constructor(width: number, height: number, initialScale: number = 100) {
    this.width = width;
    this.height = height;
    this.scale = initialScale;
    this.centerX = width / 2;
    this.centerY = height / 2;
  }

  /**
   * Updates the viewport dimensions (call on canvas resize).
   *
   * @param width  - New viewport width in pixels.
   * @param height - New viewport height in pixels.
   */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.centerX = width / 2;
    this.centerY = height / 2;
  }

  /**
   * Fits the entire system into view by computing the scale that makes the
   * outermost orbit fill the shorter canvas dimension with a padding margin.
   * Resets pan offset to (0, 0).
   *
   * @param maxOrbitAU - Radius of the outermost orbit in AU.
   * @param padding    - Extra scale factor applied as a margin (default `1.25`).
   */
  autoScale(maxOrbitAU: number, padding: number = 1.25): void {
    this.scale = Math.min(this.width, this.height) / (maxOrbitAU * 2 * padding);
    this.offsetX = 0;
    this.offsetY = 0;
  }

  /**
   * Zooms the camera by a multiplicative factor, optionally anchored to a
   * mouse position so that the point under the cursor stays fixed.
   *
   * @param factor - Scale multiplier (e.g. `1.1` to zoom in 10 %, `0.9` to zoom out).
   * @param mouseX - Mouse X in canvas pixels. Omit to zoom around the center.
   * @param mouseY - Mouse Y in canvas pixels. Omit to zoom around the center.
   */
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

  /**
   * Translates the camera by a pixel delta (panning).
   *
   * @param dx - Horizontal pan delta in pixels.
   * @param dy - Vertical pan delta in pixels.
   */
  pan(dx: number, dy: number): void {
    this.offsetX += dx;
    this.offsetY += dy;
  }

  /**
   * Returns the current canvas origin position (center of the solar system) in pixels,
   * accounting for pan offset.
   *
   * @returns `{ cx, cy }` — the pixel coordinates of the heliocentric origin.
   */
  getCenter(): { cx: number; cy: number } {
    return {
      cx: this.centerX + this.offsetX,
      cy: this.centerY + this.offsetY,
    };
  }

  /**
   * Applies the camera transform to a 2D context (translate + scale).
   * Always paired with a `restore()` call after drawing.
   *
   * @param ctx - The CanvasRenderingContext2D to transform.
   */
  applyTransform(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.centerX + this.offsetX, this.centerY + this.offsetY);
    ctx.scale(this.scale, this.scale);
  }

  /**
   * Restores the 2D context to the state before `applyTransform` was called.
   *
   * @param ctx - The CanvasRenderingContext2D to restore.
   */
  restore(ctx: CanvasRenderingContext2D): void {
    ctx.restore();
  }

  /**
   * Directly sets the camera scale without anchoring to a mouse position.
   *
   * @param scale - New zoom level in px/AU.
   */
  setScale(scale: number): void {
    this.scale = scale;
  }
}
