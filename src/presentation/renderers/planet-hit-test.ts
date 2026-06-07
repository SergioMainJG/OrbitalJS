import type { BodyState } from "@/shared/types";
import { getPlanetRadius } from "./planet-renderer";

export function getHoveredPlanet(
  mouseX: number,
  mouseY: number,
  bodies: BodyState[],
  scale: number,
  centerX: number,
  centerY: number,
  hitMargin: number = 5,
): BodyState | null {
  for (const body of bodies) {
    const px = centerX + body.x * scale;
    const py = centerY - body.y * scale; // BUG-3 fix: invert Y to match drawPlanets
    const radius = getPlanetRadius(body.mass);
    const displayRadius = body.name === "Sun" ? radius * 0.3 : radius;

    const dx = mouseX - px;
    const dy = mouseY - py;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= displayRadius + hitMargin) {
      return body;
    }
  }
  return null;
}
