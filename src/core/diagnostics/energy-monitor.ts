import type { DriftStatus } from "@/shared/types";

export const energyDrift = (currentEnergy: number, initialEnergy: number): number => {
  if (initialEnergy === 0) return 0;
  return (Math.abs(currentEnergy - initialEnergy) / Math.abs(initialEnergy)) * 100;
};

export const getDriftStatus = (driftPercent: number): DriftStatus => {
  if (driftPercent < 0.1) return "green";
  if (driftPercent <= 1) return "yellow";
  return "red";
};
