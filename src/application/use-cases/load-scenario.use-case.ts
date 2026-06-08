import type { SimulationScenario } from "@/core/contracts/scenario.contract";
import {
  setBodies,
  setCurrentDay,
  setSimSpeed,
} from "@/features/simulation/stores/simulation-store";
import { getBodyColor, getBodyRadius } from "@/presentation/renderers/body-renderer";
import { rendererRegistry } from "@/application/registries/renderer-registry";
import type { CanvasRenderer } from "@/presentation/renderers/canvas-renderer";
import type { RenderBody } from "@/shared/types";

export function loadScenario(scenario: SimulationScenario): void {
  const renderer = rendererRegistry.get("canvas") as CanvasRenderer | undefined;
  if (renderer) {
    renderer.clearTrails();
  }

  const renderBodies: RenderBody[] = scenario.bodies.map((b) => ({
    ...b,
    radius: getBodyRadius(b.mass),
    color: getBodyColor(b.name),
  }));

  setBodies(renderBodies);
  setCurrentDay(0);
  setSimSpeed(1);
}
