import { orbitalError } from "@/core/diagnostics/orbital-error";

/**
 * Returns `true` if the given positional error is within the accepted orbital tolerance.
 *
 * @param errorUA - Absolute position error in AU produced by `orbitalError`.
 * @returns `true` when `errorUA < 0.05 AU`.
 */
export function validateOrbit(errorUA: number): boolean {
  return errorUA < 0.05;
}

/**
 * Determines whether a body has returned close enough to its initial position
 * to be considered in a closed (periodic) orbit.
 *
 * @param initialX     - Initial X position in AU.
 * @param initialY     - Initial Y position in AU.
 * @param finalX       - Current X position in AU.
 * @param finalY       - Current Y position in AU.
 * @param toleranceUA  - Maximum allowed separation in AU (default `0.05 AU`).
 * @returns `true` when the body is within `toleranceUA` of its starting position.
 */
export function isClosedOrbit(
  initialX: number,
  initialY: number,
  finalX: number,
  finalY: number,
  toleranceUA = 0.05,
): boolean {
  return orbitalError(initialX, initialY, finalX, finalY) < toleranceUA;
}
