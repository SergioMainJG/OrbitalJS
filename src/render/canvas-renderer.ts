import { type RenderBody } from "@/types";
import { Camera } from "./camera";

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private camera: Camera;
  private starsCanvas: HTMLCanvasElement | null = null;
  private width: number;
  private height: number;
  private maxOrbitAU: number;

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
    this.initStarsBackground();
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

  render(bodies: RenderBody[]): void {
    this.clear();

    for (const body of bodies) {
      this.camera.applyTransform(this.ctx);

      this.ctx.beginPath();
      this.ctx.arc(body.x, body.y, body.radius / this.camera.scale, 0, Math.PI * 2);
      this.ctx.fillStyle = body.color;
      this.ctx.fill();

      this.ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      this.ctx.lineWidth = 1 / this.camera.scale;
      this.ctx.stroke();

      this.ctx.fillStyle = "#ffffff";
      this.ctx.font = `${12 / this.camera.scale}px "Courier New", monospace`;
      this.ctx.fillText(body.name, body.x + 0.08, body.y - 0.08);

      this.camera.restore(this.ctx);
    }
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
