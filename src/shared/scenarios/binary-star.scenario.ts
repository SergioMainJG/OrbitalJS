import type { SimulationScenario } from "@/core/contracts/scenario.contract";

export const BINARY_STAR_SCENARIO: SimulationScenario = {
  id: "binary-star-placeholder",
  name: "Sistema Binario (placeholder)",
  description: "Escenario placeholder para futura expansión",
  bodies: [
    { name: "Star A", mass: 1, x: -0.2, y: 0, vx: 0, vy: -0.004 },
    { name: "Star B", mass: 0.8, x: 0.2, y: 0, vx: 0, vy: 0.005 },
  ],
  maxOrbitAU: 2,
};
