import {
  setIsRunning,
  setBodies,
  setCurrentDay,
  setLogMessages,
  setFollowSpaceship,
  setShowLagrange,
  setShowHohmann,
} from "@/features/simulation/stores/simulation-store";
import { resetComparison, setIsComparing } from "@/features/comparison/stores/comparison-store";
import { clearSpaceshipTrail } from "@/presentation/renderers/draw-spaceship";
import { rendererRegistry } from "@/application/registries/renderer-registry";
import type { CanvasRenderer } from "@/presentation/renderers/canvas-renderer";

/**
 * Stops the active simulation run, resets both simulation and comparison stores,
 * and clears planet/spaceship trail arrays to free memory when leaving the simulator view.
 */
export function stopSimulation(): void {
  setIsRunning(false);

  setBodies([]);
  setCurrentDay(0);
  setFollowSpaceship(false);
  setShowLagrange(false);
  setShowHohmann(false);
  setLogMessages(["[INFO] Simulación finalizada y recursos liberados."]);

  resetComparison();
  setIsComparing(false);

  clearSpaceshipTrail();
  const renderer = rendererRegistry.get("canvas") as CanvasRenderer | undefined;
  if (renderer) {
    renderer.clearTrails();
  }
}
