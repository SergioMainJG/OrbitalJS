import type { BodyState } from "@/shared/types";

/**
 * Computes the total z-component of angular momentum for the N-body system.
 *
 * `L = Σ mᵢ · (xᵢ · vyᵢ − yᵢ · vxᵢ)`
 *
 * In a conservative simulation (no external torques) this value is conserved.
 * Growing drift indicates numerical error or non-physical forces.
 *
 * @param bodies - Array of all bodies in the simulation.
 * @returns Total angular momentum in M☉ · AU² / day.
 */
export function angularMomentum(bodies: BodyState[]): number {
  return bodies.reduce((sum, b) => sum + b.mass * (b.x * b.vy - b.y * b.vx), 0);
}
