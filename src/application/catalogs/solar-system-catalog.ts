import type { SimulationScenario } from "@/core/contracts/scenario.contract";
import type { BodyState } from "@/shared/types";
import { SOLAR_SYSTEM_SCENARIO } from "@/shared/scenarios/solar-system.scenario";
import planetsData from "@/data/planets.json";
import { fetchAllPlanets } from "@/shared/utils/jpl-horizons-fetcher";
import { parseHorizonsResponse } from "@/shared/utils/jpl-horizons-parser";
import type { PlanetKey } from "@/shared/utils/jpl-horizons-fetcher";

const SUN_MASS_KG = 1.989e30;

function adjustPlutoCharonSeparation(bodies: BodyState[]): void {
  const pluto = bodies.find((b) => b.name === "Pluto");
  const charon = bodies.find((b) => b.name === "Charon");
  if (pluto && charon) {
    const dx = pluto.x;
    const dy = pluto.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0) {
      const ux = dx / dist;
      const uy = dy / dist;
      charon.x = pluto.x + ux * 0.8;
      charon.y = pluto.y + uy * 0.8;
      charon.vx = pluto.vx;
      charon.vy = pluto.vy;
    }
  }
}

export class SolarSystemCatalog {
  getDefaultScenario(): SimulationScenario {
    return SOLAR_SYSTEM_SCENARIO;
  }

  async getScenarioFromHorizons(epoch?: string): Promise<SimulationScenario> {
    if (!epoch || epoch === "2000-Jan-01") {
      const bodies = [
        { name: "Sun", mass: 1.0, x: 0, y: 0, vx: 0, vy: 0 },
        ...planetsData.planets.map((p) => ({
          name: p.name,
          mass: p.physics.mass / SUN_MASS_KG,
          x: p.stateVector.x,
          y: p.stateVector.y,
          vx: p.stateVector.vx,
          vy: p.stateVector.vy,
        })),
      ];
      adjustPlutoCharonSeparation(bodies);
      return {
        id: "solar-system-real",
        name: "Sistema Solar Real (J2000)",
        description: `Sol + planetas principales y cuerpos menores con efemérides reales de la NASA en la época ${planetsData.epoch}`,
        epoch: planetsData.epoch,
        bodies,
        maxOrbitAU: 80.0,
      };
    }

    const rawResponses = await fetchAllPlanets(epoch);
    const bodies = [{ name: "Sun", mass: 1.0, x: 0, y: 0, vx: 0, vy: 0 }];

    for (const [key, raw] of rawResponses) {
      try {
        const conditions = parseHorizonsResponse(raw, key as PlanetKey);
        bodies.push({
          name: conditions.name,
          mass: conditions.physics.mass / SUN_MASS_KG,
          x: conditions.stateVector.x,
          y: conditions.stateVector.y,
          vx: conditions.stateVector.vx,
          vy: conditions.stateVector.vy,
        });
      } catch (err) {
        console.error(`[SolarSystemCatalog] Error parseando ${key}:`, err);
      }
    }

    adjustPlutoCharonSeparation(bodies);

    return {
      id: `solar-system-historical-${epoch}`,
      name: `Sistema Solar (${epoch})`,
      description: `Sol + planetas principales y cuerpos menores en época histórica: ${epoch}`,
      epoch,
      bodies,
      maxOrbitAU: 80.0,
    };
  }
}
