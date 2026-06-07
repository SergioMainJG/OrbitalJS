import { setIsRunning } from "@/features/simulation/stores/simulation-store";

export function pauseSimulation(): void {
  setIsRunning(false);
}
