import { orbitalError } from "@/core/diagnostics/orbital-error";

export function validateOrbit(errorUA: number): boolean {
  return errorUA < 0.05;
}

export function isClosedOrbit(
  initialX: number,
  initialY: number,
  finalX: number,
  finalY: number,
  toleranceUA = 0.05,
): boolean {
  return orbitalError(initialX, initialY, finalX, finalY) < toleranceUA;
}
