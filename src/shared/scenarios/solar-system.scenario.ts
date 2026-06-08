import type { SimulationScenario } from "@/core/contracts/scenario.contract";

export const SOLAR_SYSTEM_SCENARIO: SimulationScenario = {
  id: "solar-system-inner",
  name: "Sistema Solar Interior",
  description: "Mercurio, Venus, Tierra y Marte en condiciones iniciales J2000",
  maxOrbitAU: 1.52,
  bodies: [
    { name: "Sun", mass: 1, x: 0, y: 0, vx: 0, vy: 0 },
    {
      name: "Mercury",
      mass: 1.66e-7,
      x: 0.39,
      y: 0,
      vx: 0,
      vy: Math.sqrt((4 * Math.PI * Math.PI) / (365.25 * 365.25 * 0.39)),
    },
    {
      name: "Venus",
      mass: 2.45e-6,
      x: 0.72,
      y: 0,
      vx: 0,
      vy: Math.sqrt((4 * Math.PI * Math.PI) / (365.25 * 365.25 * 0.72)),
    },
    {
      name: "Earth",
      mass: 3.003e-6,
      x: 1.0,
      y: 0,
      vx: 0,
      vy: (2 * Math.PI) / 365.25,
    },
    {
      name: "Mars",
      mass: 3.21e-7,
      x: 1.52,
      y: 0,
      vx: 0,
      vy: Math.sqrt((4 * Math.PI * Math.PI) / (365.25 * 365.25 * 1.52)),
    },
  ],
};
