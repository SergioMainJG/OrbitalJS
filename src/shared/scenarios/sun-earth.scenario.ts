import type { SimulationScenario } from "@/core/contracts/scenario.contract";

export const SUN_EARTH_SCENARIO: SimulationScenario = {
  id: "sun-earth-comparison",
  name: "Sol + Tierra (comparación de integradores)",
  description: "Escenario mínimo para visualizar la divergencia Euler vs RK4",
  maxOrbitAU: 1.5,
  bodies: [
    { name: "Sun", mass: 1, x: 0, y: 0, vx: 0, vy: 0 },
    { name: "Earth", mass: 3e-6, x: 1, y: 0, vx: 0, vy: (2 * Math.PI) / 365.25 },
  ],
};
