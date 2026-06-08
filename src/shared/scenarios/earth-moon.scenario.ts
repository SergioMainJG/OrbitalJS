import type { SimulationScenario } from "@/core/contracts/scenario.contract";

export const EARTH_MOON_SCENARIO: SimulationScenario = {
  id: "earth-moon-placeholder",
  name: "Tierra-Luna (placeholder)",
  description: "Escenario placeholder para futura expansión",
  bodies: [{ name: "Earth", mass: 3e-6, x: 1, y: 0, vx: 0, vy: (2 * Math.PI) / 365.25 }],
  maxOrbitAU: 1.5,
};
