import type { BodyState, TrailPoint } from "@/shared/types";
import { getBodyColor, getBodyRadius, addTrailPoint } from "./body-renderer";

/**
 * Stateful service that draws all celestial bodies on a Canvas 2D context.
 *
 * Maintains a per-body trail map so that each body's orbital path can be
 * rendered as a fading polyline on every frame.
 */
export class DrawBodiesService {
  private readonly trails = new Map<string, TrailPoint[]>();

  /**
   * Renders all bodies and their orbital trails to the given context.
   *
   * Each body is drawn in three passes:
   * 1. Orbital trail (fading polyline, skipped when `showOrbit` is `false`).
   * 2. Optional solar glow halo (Sun only).
   * 3. Filled circle + name label.
   *
   * @param ctx       - Canvas 2D rendering context.
   * @param bodies    - Array of all bodies to draw.
   * @param scale     - Current camera scale in px/AU.
   * @param cx        - Canvas origin X in pixels (center + pan offset).
   * @param cy        - Canvas origin Y in pixels (center + pan offset).
   * @param showOrbit - When `false`, orbital trails are skipped (default `true`).
   */
  draw(
    ctx: CanvasRenderingContext2D,
    bodies: BodyState[],
    scale: number,
    cx: number,
    cy: number,
    showOrbit: boolean = true,
  ): void {
    for (const body of bodies) {
      const px = cx + body.x * scale;
      const py = cy - body.y * scale;

      const current = this.trails.get(body.name) ?? [];
      const updated = addTrailPoint(current, { x: px, y: py }, 200);
      this.trails.set(body.name, updated);

      const color = getBodyColor(body.name);
      const radius = getBodyRadius(body.mass);
      const displayRadius = body.name === "Sun" ? radius * 0.3 : radius;

      if (showOrbit) {
        const BUCKET_SIZE = 5;
        ctx.lineWidth = 1.5;
        for (let i = 1; i < updated.length; i += BUCKET_SIZE) {
          const bucketEnd = Math.min(i + BUCKET_SIZE, updated.length);
          const opacity = (i + Math.floor(BUCKET_SIZE / 2)) / updated.length;
          ctx.beginPath();
          ctx.moveTo(updated[i - 1]!.x, updated[i - 1]!.y);
          for (let j = i; j < bucketEnd; j++) {
            ctx.lineTo(updated[j]!.x, updated[j]!.y);
          }
          ctx.strokeStyle = `${color}${Math.floor(opacity * 255)
            .toString(16)
            .padStart(2, "0")}`;
          ctx.stroke();
        }
      }

      if (body.name === "Sun") {
        const glowRadius = displayRadius * 2;
        const glow = ctx.createRadialGradient(px, py, 0, px, py, glowRadius);
        glow.addColorStop(0, "rgba(249, 115, 22, 0.6)");
        glow.addColorStop(1, "rgba(249, 115, 22, 0)");
        ctx.beginPath();
        ctx.arc(px, py, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      ctx.shadowColor = color;
      ctx.shadowBlur = body.name === "Sun" ? 10 : 3;

      ctx.beginPath();
      ctx.arc(px, py, displayRadius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.shadowBlur = 0;

      ctx.fillStyle = "#ffffff";
      ctx.font = "11px monospace";
      ctx.fillText(body.name, px + displayRadius + 3, py - displayRadius);
    }
  }

  /** Clears all stored trail points, e.g. when loading a new scenario. */
  clearTrails(): void {
    this.trails.clear();
  }
}
