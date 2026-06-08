import { type TrailPoint } from "@/shared/types";

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

const FALLBACK_COLOR = "#a8a8a8";

export const getBodyColor = (name: string): string => {
  return PLANET_COLORS[name] ?? FALLBACK_COLOR;
};

/**
 * Radius scaling adjusted to handle the huge mass range from Pluto (6.58e-9 M☉)
 * to Jupiter (9.543e-4 M☉). Using log10 of mass normalized to Earth mass ensures
 * visually reasonable sizes across the full solar system.
 *
 * Maps the Sun (1 M☉ = 333000 Earth masses) and planets to a 2..12 px range.
 */
export const getBodyRadius = (mass: number): number => {
  const earthMasses = mass / 3.003e-6;
  if (earthMasses <= 0) return 2;
  return 2 + Math.log10(1 + Math.max(earthMasses, 0.001)) * 3;
};

export const addTrailPoint = (
  trail: TrailPoint[],
  point: TrailPoint,
  maxLength: number,
): TrailPoint[] => {
  const next = [...trail, point];
  return next.length > maxLength ? next.slice(next.length - maxLength) : next;
};
