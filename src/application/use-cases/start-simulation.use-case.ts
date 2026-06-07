import { setIsRunning } from "@/features/simulation/stores/simulation-store";

export function startSimulation(): void {
  setIsRunning(true);
}
