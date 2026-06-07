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
