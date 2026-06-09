import type { Scene } from "@/shared/types/scene";
import type { Renderer } from "@/core/contracts/renderer.contract";
import { Camera } from "./camera";
import { DrawBodiesService } from "./draw-bodies";

export class CanvasRenderer implements Renderer {
  private ctx: CanvasRenderingContext2D;
  private camera: Camera;
  private starsBitmap: ImageBitmap | null = null;
  private starsCanvas: HTMLCanvasElement | null = null;
  private width: number;
  private height: number;
  private maxOrbitAU: number;
  private readonly drawBodiesService = new DrawBodiesService();

  constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    context: CanvasRenderingContext2D,
    maxOrbitAU: number = 1.52,
  ) {
    this.ctx = context;
    this.width = width;
    this.height = height;
    this.maxOrbitAU = maxOrbitAU;
    this.camera = new Camera(width, height);
    this.camera.autoScale(maxOrbitAU);

    canvas.width = width;
    canvas.height = height;

    this.ctx.imageSmoothingEnabled = false;
  }

  initialize(): void {
    this.initStarsBackground();
  }

  public getCamera(): Camera {
    return this.camera;
  }

  public setMaxOrbitAU(val: number): void {
    this.maxOrbitAU = val;
    this.camera.autoScale(val);
  }

  /**
   * Renders 400 random stars into an off-screen surface.
   *
   * Strategy (fastest → slowest):
   * 1. `OffscreenCanvas` → `transferToImageBitmap()` — rendered off the main
   *    thread, then transferred to a GPU-resident `ImageBitmap` for zero-copy
   *    `drawImage` on every frame.
   * 2. Fallback `HTMLCanvasElement` — same rendering, same `drawImage`, but
   *    stays on the main thread.  Used on browsers that don't support
   *    `OffscreenCanvas` (Safari < 16.4, older Firefox).
   */
  private initStarsBackground(): void {
    this.starsBitmap?.close();
    this.starsBitmap = null;
    this.starsCanvas = null;

    const drawStars = (ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void => {
      ctx.fillStyle = "#0a0a2a";
      ctx.fillRect(0, 0, this.width, this.height);

      const starCount = 400;
      for (let i = 0; i < starCount; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * this.width,
          Math.random() * this.height,
          Math.random() * 1.2,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.7})`;
        ctx.fill();
      }
    };

    if (typeof OffscreenCanvas !== "undefined") {
      const offscreen = new OffscreenCanvas(this.width, this.height);
      const offCtx = offscreen.getContext("2d")!;
      drawStars(offCtx);
      this.starsBitmap = offscreen.transferToImageBitmap();
    } else {
      const fallback = document.createElement("canvas");
      fallback.width = this.width;
      fallback.height = this.height;
      drawStars(fallback.getContext("2d")!);
      this.starsCanvas = fallback;
    }
  }

  clear(): void {
    if (this.starsBitmap) {
      this.ctx.drawImage(this.starsBitmap, 0, 0);
    } else if (this.starsCanvas) {
      this.ctx.drawImage(this.starsCanvas, 0, 0);
    }
  }

  clearTrails(): void {
    this.drawBodiesService.clearTrails();
  }

  render(scene: Scene, showOrbit: boolean = true): void {
    this.clear();
    const { cx, cy } = this.camera.getCenter();
    this.drawBodiesService.draw(this.ctx, scene.bodies, this.camera.scale, cx, cy, showOrbit);
  }

  destroy(): void {
    this.starsBitmap?.close();
    this.starsBitmap = null;
    this.starsCanvas = null;
    this.drawBodiesService.clearTrails();
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.camera.resize(width, height);
    this.camera.autoScale(this.maxOrbitAU);

    const canvas = this.ctx.canvas;
    canvas.width = width;
    canvas.height = height;

    this.ctx.imageSmoothingEnabled = false;
    this.initStarsBackground();
  }
}
