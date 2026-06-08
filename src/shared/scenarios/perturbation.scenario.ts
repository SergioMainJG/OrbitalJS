import type { SimulationScenario } from "@/core/contracts/scenario.contract";
import { SOLAR_SYSTEM_SCENARIO } from "./solar-system.scenario";

export const PERTURBATION_SCENARIO: SimulationScenario = {
  id: "nemesis-perturbation",
  name: "Sistema Solar + Némesis (Perturbador)",
  description:
    "El sistema solar interior bajo el efecto de una estrella masiva (1.0 M☉) en trayectoria hiperbólica cercana.",
  maxOrbitAU: 6.0,
  bodies: [
    ...SOLAR_SYSTEM_SCENARIO.bodies,
    {
      name: "Némesis",
      mass: 1.0,
      x: 5.0,
      y: 4.0,
      vx: -0.015,
      vy: -0.01,
    },
  ],
};
