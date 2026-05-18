import type { BodyState } from "@/types";
import type { TrailPoint } from "@/types";
import { getPlanetColor, getPlanetRadius, addTrailPoint } from "@/render/planet-renderer";

const trails = new Map<string, TrailPoint[]>();

export function drawPlanets(
  ctx: CanvasRenderingContext2D,
  bodies: BodyState[],
  scale: number,
  cx: number,
  cy: number,
): void {
  for (const body of bodies) {
    const px = cx + body.x * scale;
    const py = cy + body.y * scale;

    const current = trails.get(body.name) ?? [];
    const updated = addTrailPoint(current, { x: px, y: py }, 200);
    trails.set(body.name, updated);

    const color = getPlanetColor(body.name);
    const radius = getPlanetRadius(body.mass);
    const displayRadius = body.name === "Sun" ? radius * 0.3 : radius;

    // Trail degradado
    for (let i = 1; i < updated.length; i++) {
      const opacity = i / updated.length;
      ctx.beginPath();
      ctx.moveTo(updated[i - 1]!.x, updated[i - 1]!.y);
      ctx.lineTo(updated[i]!.x, updated[i]!.y);
      ctx.strokeStyle = `${color}${Math.floor(opacity * 255)
        .toString(16)
        .padStart(2, "0")}`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Glow para el Sol
    if (body.name === "Sun") {
      const glowRadius = displayRadius * 2;
      const glow = ctx.createRadialGradient(px, py, 0, px, py, glowRadius);
      glow.addColorStop(0, "rgba(249, 115, 22, 0.6)");
      glow.addColorStop(1, "rgba(249, 115, 22, 0)");
      ctx.beginPath();
      ctx.arc(px, py, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = glow as unknown as string;
      ctx.fill();
    }

    // Sombra sutil
    ctx.shadowColor = color;
    ctx.shadowBlur = body.name === "Sun" ? 10 : 3;

    // Círculo del planeta
    ctx.beginPath();
    ctx.arc(px, py, displayRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.shadowBlur = 0;

    // Label
    ctx.fillStyle = "#ffffff";
    ctx.font = "11px monospace";
    ctx.fillText(body.name, px + displayRadius + 3, py - displayRadius);
  }
}

export function clearTrails(): void {
  trails.clear();
}
