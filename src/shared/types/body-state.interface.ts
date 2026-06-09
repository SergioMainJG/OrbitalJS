/**
 * Physical state of a celestial body used by the numerical integrators.
 *
 * Units:
 *  - Position (`x`, `y`) in Astronomical Units (AU).
 *  - Velocity (`vx`, `vy`) in AU/day.
 *  - Mass in solar masses (M☉).
 */
export interface BodyState {
  /** Unique display name (e.g. `"Earth"`, `"Spaceship-1234"`). */
  name: string;
  /** Mass in solar masses (M☉). */
  mass: number;
  /** Heliocentric X position in AU. */
  x: number;
  /** Heliocentric Y position in AU. */
  y: number;
  /** X velocity component in AU/day. */
  vx: number;
  /** Y velocity component in AU/day. */
  vy: number;
}
