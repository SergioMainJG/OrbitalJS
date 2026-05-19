import { UNIVERSAL_CONSTS } from "@/constants";
import type { BodyState } from "@/types";
import { type DriftStatus } from "@/types";

const { G } = UNIVERSAL_CONSTS;

export const kineticEnergy = (bodies: BodyState[]): number => {
  let total = 0;
  for (const body of bodies) {
    total += 0.5 * body.mass * (body.vx * body.vx + body.vy * body.vy);
  }
  return total;
};

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

export const totalEnergy = (bodies: BodyState[]): number => {
  return kineticEnergy(bodies) + potentialEnergy(bodies);
};

export const energyDrift = (currentEnergy: number, initialEnergy: number): number => {
  if (initialEnergy === 0) return 0;
  return (Math.abs(currentEnergy - initialEnergy) / Math.abs(initialEnergy)) * 100;
};

export const getDriftStatus = (driftPercent: number): DriftStatus => {
  if (driftPercent < 0.1) return "green";
  if (driftPercent <= 1) return "yellow";
  return "red";
};
