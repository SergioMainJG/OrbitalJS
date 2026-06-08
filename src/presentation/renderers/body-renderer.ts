import { type TrailPoint } from "@/shared/types";

// BUG FIX: Added colors for all planets including outer planets and Pluto
const PLANET_COLORS: Record<string, string> = {
  Sun: "#f97316",
  Mercury: "#9ca3af",
  Venus: "#facc15",
  Earth: "#3b82f6",
  Mars: "#ef4444",
  // Outer planets
  Jupiter: "#c2956e", // warm tan/brown (cloud bands)
  Saturn: "#e8d5a3", // pale golden (rings implied)
  Uranus: "#7de8e8", // pale cyan (methane atmosphere)
  Neptune: "#3f54ba", // deep blue (methane + hydrogen)
  Pluto: "#c8beb2", // pale gray-brown (icy surface)
};

const FALLBACK_COLOR = "#a8a8a8";

export const getBodyColor = (name: string): string => {
  return PLANET_COLORS[name] ?? FALLBACK_COLOR;
};

/**
 * BUG FIX: radius scaling adjusted to handle the huge mass range from Pluto (6.58e-9 M☉)
 * to Jupiter (9.543e-4 M☉). Using log10 of mass normalized to Earth mass ensures
 * visually reasonable sizes across the full solar system.
 */
export const getBodyRadius = (mass: number): number => {
  // Mass in solar masses → convert to Earth masses for the log scale
  const earthMasses = mass / 3.003e-6;
  if (earthMasses <= 0) return 2;
  // Sun (mass=1 M☉ = 333000 ME) → large glow; planets → 2..12 px range
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
