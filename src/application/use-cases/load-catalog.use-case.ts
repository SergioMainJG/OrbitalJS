import type { SimulationScenario } from "@/core/contracts/scenario.contract";
import { SolarSystemCatalog } from "@/application/catalogs/solar-system-catalog";

const solarSystemCatalog = new SolarSystemCatalog();

export function loadDefaultCatalogScenario(): SimulationScenario {
  return solarSystemCatalog.getDefaultScenario();
}
