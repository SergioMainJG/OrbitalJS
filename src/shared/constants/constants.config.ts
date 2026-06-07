export const UNIVERSAL_CONSTS = {
  /** Euler trail capped at 80 points — divergence becomes visible quickly */
  EULER_TRAIL_LENGTH: 80,
  /** Max trail length for the stable RK4 path */
  RK4_TRAIL_LENGTH: 200,
  /** Gravitational constant in AU^3 / (M☉ · day^2) */
  G: (4 * Math.PI * Math.PI) / (365.25 * 365.25),
} as const;

export const MAX_ORBIT_AU = 1.52;
