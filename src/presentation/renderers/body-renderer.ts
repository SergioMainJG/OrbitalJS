/** Canvas color map for each body name. Used by `getBodyColor`. */
const PLANET_COLORS: Record<string, string> = {
  Sun: "#f97316",
  Mercury: "#9ca3af",
  Venus: "#facc15",
  Earth: "#3b82f6",
  Mars: "#ef4444",
  Jupiter: "#c2956e",
  Saturn: "#e8d5a3",
  Uranus: "#7de8e8",
  Neptune: "#3f54ba",
  Pluto: "#c8beb2",
};

/** Color returned for any body name not found in `PLANET_COLORS`. */
const FALLBACK_COLOR = "#a8a8a8";

/**
 * Returns the CSS hex color for a given body name.
 * Falls back to `FALLBACK_COLOR` for unknown names.
 *
 * @param name - Body display name (e.g. `"Earth"`, `"Jupiter"`).
 * @returns CSS hex color string.
 */
export const getBodyColor = (name: string): string => {
  return PLANET_COLORS[name] ?? FALLBACK_COLOR;
};

/**
 * Computes the canvas display radius for a body based on its mass.
 *
 * Radius scaling adjusted to handle the huge mass range from Pluto (6.58e-9 M☉)
 * to Jupiter (9.543e-4 M☉). Using log10 of mass normalized to Earth mass ensures
 * visually reasonable sizes across the full solar system.
 *
 * Maps the Sun (1 M☉ = 333000 Earth masses) and planets to a 2..12 px range.
 *
 * @param mass - Body mass in solar masses (M☉).
 * @returns Display radius in canvas pixels.
 */
export const getBodyRadius = (mass: number): number => {
  const earthMasses = mass / 3.003e-6;
  if (earthMasses <= 0) return 2;
  return 2 + Math.log10(1 + Math.max(earthMasses, 0.001)) * 3;
};

import { type TrailPoint } from "@/shared/types";

/**
 * Appends a new canvas pixel point to a trail and enforces the maximum trail length.
 *
 * @param trail     - Existing trail points array.
 * @param point     - New pixel coordinate `{ x, y }` to append.
 * @param maxLength - Maximum number of points to retain (oldest are dropped).
 * @returns A new array with the point appended, trimmed to `maxLength`.
 */
export const addTrailPoint = (
  trail: TrailPoint[],
  point: TrailPoint,
  maxLength: number,
): TrailPoint[] => {
  const next = [...trail, point];
  return next.length > maxLength ? next.slice(next.length - maxLength) : next;
};
