import type { SimulationScenario } from "@/core/contracts/scenario.contract";

export const SOLAR_SYSTEM_SCENARIO: SimulationScenario = {
  id: "solar-system-inner",
  name: "Sistema Solar Interior",
  description: "Mercurio, Venus, Tierra y Marte en condiciones iniciales J2000",
  maxOrbitAU: 1.52,
  bodies: [
    { name: "Sun", mass: 1, x: 0, y: 0, vx: 0, vy: 0 },
    { name: "Earth", mass: 3e-6, x: 1.0, y: 0, vx: 0, vy: (2 * Math.PI) / 365.25 },
    {
      name: "Mars",
      mass: 3.2e-7,
      x: 1.52,
      y: 0,
      vx: 0,
      vy: (2 * Math.PI) / (365.25 * Math.pow(1.52, 1.5)),
    },
    {
      name: "Venus",
      mass: 2.4e-6,
      x: 0.72,
      y: 0,
      vx: 0,
      vy: (2 * Math.PI) / (365.25 * Math.pow(0.72, 1.5)),
    },
  ],
};
