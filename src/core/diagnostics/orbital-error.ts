/**
 * Computes the Euclidean distance between two 2-D positions in AU.
 * Used as the position-error metric to evaluate orbital closure.
 *
 * @param initialX - X coordinate of the reference (initial) position in AU.
 * @param initialY - Y coordinate of the reference (initial) position in AU.
 * @param finalX   - X coordinate of the comparison (final) position in AU.
 * @param finalY   - Y coordinate of the comparison (final) position in AU.
 * @returns Absolute position error in AU.
 */
export function orbitalError(
  initialX: number,
  initialY: number,
  finalX: number,
  finalY: number,
): number {
  const dx = finalX - initialX;
  const dy = finalY - initialY;

  return Math.sqrt(dx * dx + dy * dy);
}
