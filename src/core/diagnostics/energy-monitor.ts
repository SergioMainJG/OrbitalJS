import type { DriftStatus } from "@/shared/types";

/**
 * Computes the relative energy drift as a percentage.
 *
 * `drift = |E(t) − E(0)| / |E(0)| × 100`
 *
 * Returns `0` when `initialEnergy` is zero to avoid division by zero.
 *
 * @param currentEnergy - Total mechanical energy at the current simulation step.
 * @param initialEnergy - Total mechanical energy at simulation start.
 * @returns Drift percentage (0–∞). Values above 1% typically indicate integrator instability.
 */
export const energyDrift = (currentEnergy: number, initialEnergy: number): number => {
  if (initialEnergy === 0) return 0;
  return (Math.abs(currentEnergy - initialEnergy) / Math.abs(initialEnergy)) * 100;
};

/**
 * Maps an energy drift percentage to a three-level visual status indicator.
 *
 * - `"green"`  — drift < 0.1 %  (excellent conservation)
 * - `"yellow"` — drift ≤ 1 %    (acceptable, watch for growth)
 * - `"red"`    — drift > 1 %    (significant numerical error)
 *
 * @param driftPercent - Drift percentage produced by `energyDrift`.
 * @returns A `DriftStatus` string for conditional styling in the UI.
 */
export const getDriftStatus = (driftPercent: number): DriftStatus => {
  if (driftPercent < 0.1) return "green";
  if (driftPercent <= 1) return "yellow";
  return "red";
};
