import type { BodyState } from "@/shared/types";

export function angularMomentum(bodies: BodyState[]): number {
  return bodies.reduce((sum, b) => sum + b.mass * (b.x * b.vy - b.y * b.vx), 0);
}
