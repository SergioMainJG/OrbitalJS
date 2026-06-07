import type { SimulationScenario } from "@/core/contracts/scenario.contract";
import {
  setBodies,
  setCurrentDay,
  setSimSpeed,
} from "@/features/simulation/stores/simulation-store";
import { getBodyColor, getBodyRadius } from "@/presentation/renderers/body-renderer";
import { clearTrails } from "@/presentation/renderers/draw-bodies";
import type { RenderBody } from "@/shared/types";

export function loadScenario(scenario: SimulationScenario): void {
  clearTrails();

  const renderBodies: RenderBody[] = scenario.bodies.map((b) => ({
    ...b,
    radius: getBodyRadius(b.mass),
    color: getBodyColor(b.name),
  }));

  setBodies(renderBodies);
  setCurrentDay(0);
  setSimSpeed(1);
}
