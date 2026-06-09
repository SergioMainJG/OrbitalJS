import { UNIVERSAL_CONSTS } from "@/shared/constants";
import type { BodyState } from "@/shared/types";

/** G in AU³ / (M☉ · day²). */
const { G } = UNIVERSAL_CONSTS;

/**
 * Computes the total kinetic energy of the N-body system.
 *
 * `K = Σ ½ · mᵢ · vᵢ²`
 *
 * @param bodies - Array of all bodies in the simulation.
 * @returns Total kinetic energy in M☉ · AU² / day².
 */
export const kineticEnergy = (bodies: BodyState[]): number => {
  let total = 0;
  for (const body of bodies) {
    total += 0.5 * body.mass * (body.vx * body.vx + body.vy * body.vy);
  }
  return total;
};

/**
 * Computes the total gravitational potential energy of the N-body system.
 *
 * `U = −Σ_{i<j} G · mᵢ · mⱼ / rᵢⱼ`
 *
 * Pairs with zero separation are skipped to avoid division by zero.
 *
 * @param bodies - Array of all bodies in the simulation.
 * @returns Total potential energy in M☉ · AU² / day² (always ≤ 0).
 */
export const potentialEnergy = (bodies: BodyState[]): number => {
  let total = 0;
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const bi = bodies[i]!;
      const bj = bodies[j]!;
      const dx = bj.x - bi.x;
      const dy = bj.y - bi.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist === 0) continue;
      total -= (G * bi.mass * bj.mass) / dist;
    }
  }
  return total;
};

/**
 * Computes the total mechanical energy of the N-body system: `E = K + U`.
 *
 * In a conservative (no drag, no collisions) simulation this value should
 * remain constant. Growing drift indicates numerical error accumulation.
 *
 * @param bodies - Array of all bodies in the simulation.
 * @returns Total mechanical energy in M☉ · AU² / day².
 */
export const totalEnergy = (bodies: BodyState[]): number => {
  return kineticEnergy(bodies) + potentialEnergy(bodies);
};
