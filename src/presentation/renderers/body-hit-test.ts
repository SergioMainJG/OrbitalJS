import type { BodyState } from "@/shared/types";
import { getBodyRadius } from "./body-renderer";

export function getHoveredBody(
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
    const py = centerY - body.y * scale; // invertir Y: simulación Y↑, canvas Y↓
    const radius = getBodyRadius(body.mass);
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
