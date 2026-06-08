import type { SimulationScenario } from "@/core/contracts/scenario.contract";

// Gravitational constant in AU³ / (M☉ · day²)
const G = (4 * Math.PI * Math.PI) / (365.25 * 365.25);

// Mass of stars: 1.0 M☉ and 1.0 M☉
// Orbit distance d = 1.0 AU
// Orbital speed v = sqrt(G / 2)
const vBin = Math.sqrt(G / 2);

export const BINARY_STAR_SCENARIO: SimulationScenario = {
  id: "binary-star-placeholder",
  name: "Sistema de Estrella Binaria",
  description: "Dos estrellas de 1.0 M☉ orbitando circularmente en torno a su baricentro.",
  maxOrbitAU: 2.0,
  bodies: [
    { name: "Estrella A", mass: 1.0, x: -0.5, y: 0, vx: 0, vy: -vBin },
    { name: "Estrella B", mass: 1.0, x: 0.5, y: 0, vx: 0, vy: vBin },
  ],
};
