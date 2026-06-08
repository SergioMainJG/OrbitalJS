import type { BodyState } from "@/shared/types";

/**
 * Condiciones iniciales del sistema solar interior.
 * Masas en unidades solares, posiciones en AU, velocidades en AU/dia.
 */
export const SOLAR_SYSTEM_INITIAL: BodyState[] = [
  {
    name: "Sun",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    mass: 1,
  },
  {
    name: "Mercury",
    x: 0.39,
    y: 0,
    vx: 0,
    vy: Math.sqrt((4 * Math.PI * Math.PI) / (365.25 * 365.25 * 0.39)),
    mass: 1.66e-7,
  },
  {
    name: "Venus",
    x: 0.72,
    y: 0,
    vx: 0,
    vy: Math.sqrt((4 * Math.PI * Math.PI) / (365.25 * 365.25 * 0.72)),
    mass: 2.45e-6,
  },
  {
    name: "Earth",
    x: 1.0,
    y: 0,
    vx: 0,
    vy: (2 * Math.PI) / 365.25,
    mass: 3.003e-6,
  },
  {
    name: "Mars",
    x: 1.52,
    y: 0,
    vx: 0,
    vy: Math.sqrt((4 * Math.PI * Math.PI) / (365.25 * 365.25 * 1.52)),
    mass: 3.21e-7,
  },
];

/**
 * Sistema Tierra-Sol simplificado para comparacion de integradores.
 */
export const SUN_EARTH_INITIAL: BodyState[] = [
  { name: "Sun", mass: 1, x: 0, y: 0, vx: 0, vy: 0 },
  {
    name: "Earth",
    mass: 3e-6,
    x: 1,
    y: 0,
    vx: 0,
    vy: (2 * Math.PI) / 365.25,
  },
];
