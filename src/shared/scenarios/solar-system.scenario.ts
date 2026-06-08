import type { SimulationScenario } from "@/core/contracts/scenario.contract";

// Gravitational constant in AU³ / (M☉ · day²)
const G = (4 * Math.PI * Math.PI) / (365.25 * 365.25);

/**
 * Circular orbit speed at distance r (AU) from a body of mass M (solar masses).
 * v = sqrt(G * M / r)
 */
const vCirc = (r: number, M = 1) => Math.sqrt((G * M) / r);

/**
 * Full solar system scenario: Sun + 8 planets + Pluto.
 * All bodies start on the positive X axis (simplified but stable).
 *
 * Masses in M☉, positions in AU, velocities in AU/day.
 * Sources: NASA Planetary Fact Sheet, JPL Horizons.
 */
export const SOLAR_SYSTEM_SCENARIO: SimulationScenario = {
  id: "solar-system-full",
  name: "Sistema Solar Completo",
  description: "Sol + 8 planetas + Plutón en condiciones iniciales circulares J2000",
  maxOrbitAU: 40,
  bodies: [
    { name: "Sun", mass: 1, x: 0, y: 0, vx: 0, vy: 0 },

    {
      name: "Mercury",
      mass: 1.66e-7,
      x: 0.387,
      y: 0,
      vx: 0,
      vy: vCirc(0.387),
    },
    {
      name: "Venus",
      mass: 2.45e-6,
      x: 0.723,
      y: 0,
      vx: 0,
      vy: vCirc(0.723),
    },
    {
      name: "Earth",
      mass: 3.003e-6,
      x: 1.0,
      y: 0,
      vx: 0,
      vy: vCirc(1.0),
    },
    {
      name: "Mars",
      mass: 3.213e-7,
      x: 1.524,
      y: 0,
      vx: 0,
      vy: vCirc(1.524),
    },

    {
      name: "Jupiter",
      // 1 Jupiter mass = 9.543e-4 M☉
      mass: 9.543e-4,
      x: 5.203,
      y: 0,
      vx: 0,
      vy: vCirc(5.203),
    },
    {
      name: "Saturn",
      // 1 Saturn mass = 2.857e-4 M☉
      mass: 2.857e-4,
      x: 9.537,
      y: 0,
      vx: 0,
      vy: vCirc(9.537),
    },
    {
      name: "Uranus",
      // 1 Uranus mass = 4.366e-5 M☉
      mass: 4.366e-5,
      x: 19.191,
      y: 0,
      vx: 0,
      vy: vCirc(19.191),
    },
    {
      name: "Neptune",
      // 1 Neptune mass = 5.151e-5 M☉
      mass: 5.151e-5,
      x: 30.069,
      y: 0,
      vx: 0,
      vy: vCirc(30.069),
    },

    {
      name: "Pluto",
      // 1 Pluto mass = 6.58e-9 M☉
      mass: 6.58e-9,
      x: 39.5,
      y: 0,
      vx: 0,
      vy: vCirc(39.5),
    },
  ],
};
