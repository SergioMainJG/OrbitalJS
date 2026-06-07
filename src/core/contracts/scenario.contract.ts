import type { BodyState } from "@/shared/types";

export interface SimulationScenario {
  id: string;
  name: string;
  description?: string;
  epoch?: string;
  bodies: BodyState[];
  maxOrbitAU?: number;
}
