import { PLANET_COLORS, FALLBACK_COLOR } from "@/shared/constants";

/**
 * Returns the CSS hex color for a planet by display name.
 * Falls back to `FALLBACK_COLOR` when the name is not in the catalog.
 *
 * @param name - Planet display name (e.g. `"Earth"`, `"Jupiter"`).
 * @returns CSS hex color string.
 */
export const getPlanetColor = (name: string): string => {
  return PLANET_COLORS[name] ?? FALLBACK_COLOR;
};

/**
 * Computes a display radius from a body's mass for use in catalog/scenario contexts.
 *
 * Uses a logarithmic scale so that planets spanning several orders of magnitude
 * in mass still produce readable, proportional icons.
 *
 * @param mass - Body mass in solar masses (M☉).
 * @returns Display radius in canvas pixels.
 */
export const getPlanetRadius = (mass: number): number => {
  return 2 + Math.log10(1 + mass * 1e6) * 3;
};
