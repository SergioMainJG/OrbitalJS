import {
  initComparison,
  resetComparison,
  setIsComparing,
} from "@/features/comparison/stores/comparison-store";
import { bodies } from "@/features/simulation/stores/simulation-store";

/**
 * startComparison passes the current simulation bodies to
 * initComparison so the overlay diverges from the actual planet positions.
 */
export function startComparison(): void {
  const currentBodies = bodies();
  initComparison(currentBodies);
  setIsComparing(true);
}

export function stopComparison(): void {
  resetComparison();
  setIsComparing(false);
}
