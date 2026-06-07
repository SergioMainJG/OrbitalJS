import type { PlanetInitialConditions } from "@/shared/types";
import type { PlanetKey } from "@/shared/utils/jpl-horizons-fetcher";
import { fetchAllPlanets } from "@/shared/utils/jpl-horizons-fetcher";
import { parseHorizonsResponse } from "@/shared/utils/jpl-horizons-parser";

export class HorizonsService {
  async fetchAndParse(epoch: string): Promise<PlanetInitialConditions[]> {
    const raw = await fetchAllPlanets(epoch);
    return Array.from(raw.entries()).map(([key, response]) =>
      parseHorizonsResponse(response, key as PlanetKey),
    );
  }
}
