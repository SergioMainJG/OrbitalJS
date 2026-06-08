import type { SimulationScenario } from "@/core/contracts/scenario.contract";

// Gravitational constant in AU³ / (M☉ · day²)
const G = (4 * Math.PI * Math.PI) / (365.25 * 365.25);

const ME = 3.003e-6; // Earth mass in M☉
const MM = 3.69e-8; // Moon mass in M☉
const d = 0.00257; // Average Earth-Moon distance in AU

// Orbital speed of the Moon around Earth (relative to Earth)
const vRel = Math.sqrt((G * (ME + MM)) / d);

// Velocities relative to barycenter
const vEarth = -vRel * (MM / (ME + MM));
const vMoon = vRel * (ME / (ME + MM));

// Positions relative to barycenter
const xEarth = -d * (MM / (ME + MM));
const xMoon = d * (ME / (ME + MM));

export const EARTH_MOON_SCENARIO: SimulationScenario = {
  id: "earth-moon-placeholder",
  name: "Sistema Tierra - Luna",
  description: "La Luna orbitando en torno a la Tierra (barycenter heliocéntrico aislado).",
  maxOrbitAU: 0.006,
  bodies: [
    { name: "Earth", mass: ME, x: xEarth, y: 0, vx: 0, vy: vEarth },
    { name: "Moon", mass: MM, x: xMoon, y: 0, vx: 0, vy: vMoon },
  ],
};
