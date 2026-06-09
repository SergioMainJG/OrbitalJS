import type { Vector3 } from "./vector3";

/** Classifies the physical type of a body in the simulation catalog. */
export enum BodyType {
  Star = "Star",
  Planet = "Planet",
  Moon = "Moon",
  Asteroid = "Asteroid",
  Comet = "Comet",
  Spacecraft = "Spacecraft",
  Custom = "Custom",
}

/**
 * Full descriptor of a celestial body as stored in the catalog.
 * Used when loading a scenario, before being mapped to a flat `BodyState`.
 */
export interface CelestialBody {
  /** Unique catalog identifier. */
  id: string;
  /** Display name (e.g. `"Earth"`, `"Alpha Centauri A"`). */
  name: string;
  /** Mass in solar masses (M☉). */
  mass: number;
  /** Mean radius in AU. */
  radius: number;
  /** 3-D position in AU (heliocentric, J2000 ecliptic). */
  position: Vector3;
  /** 3-D velocity in AU/day. */
  velocity: Vector3;
  /** Classification of the body. */
  type: BodyType;
  /** Optional CSS hex color for rendering. Falls back to mass-based color if omitted. */
  color?: string;
}
