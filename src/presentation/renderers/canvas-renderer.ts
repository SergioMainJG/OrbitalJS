import type { Scene } from "@/shared/types/scene";
import type { Renderer } from "@/core/contracts/renderer.contract";
import { Camera } from "./camera";
import { DrawBodiesService } from "./draw-bodies";

export class CanvasRenderer implements Renderer {
  private ctx: CanvasRenderingContext2D;
  private camera: Camera;
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

  private initStarsBackground(): void {
    this.starsCanvas = document.createElement("canvas");
    this.starsCanvas.width = this.width;
    this.starsCanvas.height = this.height;
    const starsCtx = this.starsCanvas.getContext("2d")!;

    starsCtx.fillStyle = "#0a0a2a";
    starsCtx.fillRect(0, 0, this.width, this.height);

    const starCount = 400;
    for (let i = 0; i < starCount; i++) {
      starsCtx.beginPath();
      starsCtx.arc(
        Math.random() * this.width,
        Math.random() * this.height,
        Math.random() * 1.2,
        0,
        Math.PI * 2,
      );
      starsCtx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.7})`;
      starsCtx.fill();
    }
  }

  clear(): void {
    if (this.starsCanvas) {
      this.ctx.drawImage(this.starsCanvas, 0, 0);
    }
  }

  clearTrails(): void {
    this.drawBodiesService.clearTrails();
  }

  render(scene: Scene): void {
    this.clear();
    this.drawBodiesService.draw(
      this.ctx,
      scene.bodies,
      this.camera.scale,
      this.width / 2,
      this.height / 2,
    );
  }

  destroy(): void {
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
