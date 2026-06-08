export const UNIVERSAL_CONSTS = {
  /** Euler trail capped at 80 points — divergence becomes visible quickly */
  EULER_TRAIL_LENGTH: 80,
  /** Max trail length for the stable RK4 path */
  RK4_TRAIL_LENGTH: 200,
  /** Gravitational constant in AU^3 / (M☉ · day^2) */
  G: (4 * Math.PI * Math.PI) / (365.25 * 365.25),
  /**
   * Maximum effective dt for Euler integration.
   * Euler becomes numerically unstable above ~1 day step for a 1 AU orbit.
   * We cap the effective step to prevent planet blow-up at high sim speeds.
   * RK4 is stable up to ~5 days, so we apply a softer cap there.
   */
  MAX_DT_EULER: 1.0, // AU-day units; beyond this Euler diverges visibly
  MAX_DT_RK4: 5.0, // RK4 is much more stable, allow higher steps
} as const;

export const MAX_ORBIT_AU = 40;
