import type { SimulationScenario } from "@/core/contracts/scenario.contract";
import { SOLAR_SYSTEM_SCENARIO } from "@/shared/scenarios/solar-system.scenario";

export class SolarSystemCatalog {
  getDefaultScenario(): SimulationScenario {
    return SOLAR_SYSTEM_SCENARIO;
  }

  async getScenarioFromHorizons(_epoch?: string): Promise<SimulationScenario> {
    throw new Error("Not implemented — run bun run fetch:planets first");
  }
}
