import type { BodyState } from "@/shared/types";
import { getBodyRadius } from "./body-renderer";

/**
 * Returns the body under the mouse cursor, or `null` if none is hit.
 *
 * Uses the same display radius as the renderer so the hit region exactly
 * matches what is drawn on screen. An optional `hitMargin` extends the
 * clickable area beyond the visual boundary to ease interaction on small bodies.
 *
 * @param mouseX    - Mouse X position in canvas pixels.
 * @param mouseY    - Mouse Y position in canvas pixels.
 * @param bodies    - All bodies currently in the simulation.
 * @param scale     - Current camera scale in px/AU.
 * @param centerX   - Canvas origin X (center + pan offset) in pixels.
 * @param centerY   - Canvas origin Y (center + pan offset) in pixels.
 * @param hitMargin - Extra radius in pixels added to each body's hit zone (default `5`).
 * @returns The first `BodyState` hit by the cursor, or `null` if none.
 */
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
