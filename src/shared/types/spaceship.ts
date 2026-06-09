import type { BodyState } from "./body-state.interface";

/** Phase of the spaceship launch gesture. */
export type LaunchPhase = "idle" | "aiming" | "launched";

/** Tracks mouse coordinates during a spaceship drag-to-launch interaction. */
export interface LaunchState {
  /** Current phase of the launch gesture. */
  phase: LaunchPhase;
  /** Canvas pixel position where the mousedown began. `null` when idle. */
  originCanvas: { x: number; y: number } | null;
  /** Current mouse canvas position while dragging. `null` when idle. */
  currentCanvas: { x: number; y: number } | null;
}

/** Mass of the spacecraft in solar masses — negligible relative to planets. */
export const SPACESHIP_MASS = 1e-25;
/** Prefix used for every spaceship body name. Used to distinguish ships from planets. */
export const SPACESHIP_NAME = "Spaceship";
/** Maximum number of trail points kept in memory per spacecraft. */
export const SPACESHIP_TRAIL_LENGTH = 300;
/** px per AU/day used when rendering the velocity arrow during aiming. */
export const VELOCITY_ARROW_SCALE = 60;
/** Legacy speed factor — kept for reference, superseded by `dragToVelocity`. */
export const SPACESHIP_LAUNCH_SPEED_FACTOR = 0.05;
/** Fallback spacecraft collision radius in AU (used only when camera scale is unavailable). */
export const SPACESHIP_COLLISION_RADIUS_AU = 0.01;

/** Per-body collision radii in AU, consistent with their visual radii at default zoom. */
export const BODY_COLLISION_RADII_AU: Record<string, number> = {
  Sun: 0.05,
  Mercury: 0.008,
  Venus: 0.015,
  Earth: 0.015,
  Mars: 0.01,
};

/** G in AU³ / (M☉ · day²), derived from Kepler's third law: G = 4π² / yr². */
const G_AU_DAY = (4 * Math.PI * Math.PI) / (365.25 * 365.25);

/**
 * Converts the canvas drag vector (px) into initial velocity in AU/day.
 *
 * Design intent:
 *   - A short drag (~50 px) → suborbital speed (~0.5× vOrbital)
 *   - A medium drag (~150 px) → roughly circular orbit speed (~1× vOrbital)
 *   - A long drag (~300+ px) → escape trajectory (>√2 × vOrbital)
 *
 * The old sensitivity (0.015) was ~25× too low, causing every ship to
 * immediately freefall into the Sun regardless of drag direction or speed.
 * Raising it to 0.4 gives intuitive orbital control across the full drag range.
 *
 * dragMultiplier in spaceship-launcher.ts is kept at 1.0 — the sensitivity
 * here is the single source of truth for launch speed.
 *
 * @param dragPx      - Canvas drag vector in pixels `{ dx, dy }`.
 * @param scale       - Current camera scale in px/AU.
 * @param launchPosAU - Optional heliocentric launch position used to compute vOrbital.
 *                      Defaults to `r = 1 AU` when omitted.
 * @returns Velocity vector `{ vx, vy }` in AU/day.
 */
export function dragToVelocity(
  dragPx: { dx: number; dy: number },
  scale: number,
  launchPosAU?: { x: number; y: number },
): { vx: number; vy: number } {
  const r = launchPosAU ? Math.sqrt(launchPosAU.x ** 2 + launchPosAU.y ** 2) : 1.0;
  const rClamped = Math.max(r, 0.01);
  const vOrbital = Math.sqrt(G_AU_DAY / rClamped);

  // 0.4 → a 150 px drag at scale=100 in a 1 AU orbit gives ~vOrbital
  // (150/100) * vOrbital * 0.4 = 0.6 × vOrbital  (slightly suborbital — good default)
  // (300/100) * vOrbital * 0.4 = 1.2 × vOrbital  (slightly above circular — escape starts at √2)
  const sensitivity = 0.4;

  return {
    vx: (dragPx.dx / scale) * vOrbital * sensitivity,
    vy: (-dragPx.dy / scale) * vOrbital * sensitivity,
  };
}

/**
 * Converts a canvas pixel coordinate to a heliocentric AU position.
 *
 * @param canvasPx - Point in canvas pixels `{ x, y }`.
 * @param cx       - Canvas origin X (center with pan offset) in pixels.
 * @param cy       - Canvas origin Y (center with pan offset) in pixels.
 * @param scale    - Current camera scale in px/AU.
 * @returns Heliocentric position `{ x, y }` in AU. Y-axis is flipped (canvas Y↓ → sim Y↑).
 */
export function canvasToAU(
  canvasPx: { x: number; y: number },
  cx: number,
  cy: number,
  scale: number,
): { x: number; y: number } {
  return {
    x: (canvasPx.x - cx) / scale,
    y: -(canvasPx.y - cy) / scale,
  };
}

/**
 * Creates a `BodyState` for a new spacecraft ready to be fed to the RK4 integrator.
 *
 * @param posAU    - Heliocentric position in AU.
 * @param velAUDay - Initial velocity in AU/day.
 * @returns A `BodyState` with `SPACESHIP_NAME` and `SPACESHIP_MASS`.
 */
export function createSpaceshipBody(
  posAU: { x: number; y: number },
  velAUDay: { vx: number; vy: number },
): BodyState {
  return {
    name: SPACESHIP_NAME,
    mass: SPACESHIP_MASS,
    x: posAU.x,
    y: posAU.y,
    vx: velAUDay.vx,
    vy: velAUDay.vy,
  };
}
