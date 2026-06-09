import { UNIVERSAL_CONSTS } from "@/shared/constants";
import type { BodyState } from "@/shared/types";

/** G in AU³ / (M☉ · day²). */
const { G } = UNIVERSAL_CONSTS;

/**
 * Computes the specific orbital energy of a body relative to a central mass.
 *
 * `ε = v²/2 − G·M/r`
 *
 * A negative value indicates a bound (elliptic) orbit; positive means the body
 * is on an escape (hyperbolic) trajectory. Returns `0` when `r = 0` to avoid
 * division by zero.
 *
 * @param body    - Body whose orbital energy is computed.
 * @param sunMass - Mass of the central attractor in M☉ (defaults to 1 M☉ = the Sun).
 * @returns Specific orbital energy in AU²/day².
 */
export function orbitalEnergy(body: BodyState, sunMass: number = 1): number {
  const r = Math.sqrt(body.x * body.x + body.y * body.y);

  if (r === 0) return 0;

  const v2 = body.vx * body.vx + body.vy * body.vy;
  return v2 / 2 - (G * sunMass) / r;
}
