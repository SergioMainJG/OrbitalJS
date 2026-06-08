import { UNIVERSAL_CONSTS } from "@/shared/constants";
import type { BodyState } from "@/shared/types";

const { G } = UNIVERSAL_CONSTS;

export function orbitalEnergy(body: BodyState, sunMass: number = 1): number {
  const r = Math.sqrt(body.x * body.x + body.y * body.y);

  if (r === 0) return 0;

  const v2 = body.vx * body.vx + body.vy * body.vy;
  return v2 / 2 - (G * sunMass) / r;
}
