import { resetComparison, setIsComparing } from "@/features/comparison/stores/comparison-store";

export function startComparison(): void {
  resetComparison();
  setIsComparing(true);
}

export function stopComparison(): void {
  resetComparison();
  setIsComparing(false);
}
