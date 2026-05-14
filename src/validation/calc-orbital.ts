/*
 *calc distancia/error orbital
 */
export function calculateOrbitalError(
  initialX: number,
  initialY: number,
  finalX: number,
  finalY: number,
) {
  const dx = finalX - initialX;
  const dy = finalY - initialY;

  return Math.sqrt(dx * dx + dy * dy);
}
