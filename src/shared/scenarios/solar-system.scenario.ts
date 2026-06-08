import type { SimulationScenario } from "@/core/contracts/scenario.contract";
import planetsData from "@/data/planets.json";

// Gravitational constant in AU³ / (M☉ · day²)
const G = (4 * Math.PI * Math.PI) / (365.25 * 365.25);

const SUN_MASS_KG = 1.989e30;

/**
 * Circular orbit speed at distance r (AU) from a body of mass M (solar masses).
 * v = sqrt(G * M / r)
 */
const vCirc = (r: number, M = 1) => Math.sqrt((G * M) / r);

const FALLBACK_MASSES: Record<string, number> = {
  Mercury: 1.66e-7,
  Venus: 2.45e-6,
  Earth: 3.003e-6,
  Mars: 3.213e-7,
};

const getPlanetData = (name: string, fallbackX: number, fallbackVy: number) => {
  const planet = planetsData.planets.find((p) => p.name === name);
  if (!planet) {
    return {
      mass: FALLBACK_MASSES[name] ?? 1.0e-7,
      x: fallbackX,
      y: 0,
      vx: 0,
      vy: fallbackVy,
    };
  }
  return {
    mass: planet.physics.mass / SUN_MASS_KG,
    x: planet.stateVector.x,
    y: planet.stateVector.y,
    vx: planet.stateVector.vx,
    vy: planet.stateVector.vy,
  };
};

/**
 * N-Body real initial conditions from JPL Horizons (J2000 epoch).
 * Sun + 4 inner planets (Mercury, Venus, Earth, Mars).
 */
export const SOLAR_SYSTEM_SCENARIO: SimulationScenario = {
  id: "solar-system-full",
  name: "Sistema Solar Real (J2000)",
  description: "Sol + 4 planetas interiores con efemérides reales de la NASA JPL Horizons (J2000)",
  maxOrbitAU: 2.0,
  bodies: [
    { name: "Sun", mass: 1, x: 0, y: 0, vx: 0, vy: 0 },
    { name: "Mercury", ...getPlanetData("Mercury", 0.387, vCirc(0.387)) },
    { name: "Venus", ...getPlanetData("Venus", 0.723, vCirc(0.723)) },
    { name: "Earth", ...getPlanetData("Earth", 1.0, vCirc(1.0)) },
    { name: "Mars", ...getPlanetData("Mars", 1.524, vCirc(1.524)) },
  ],
};
