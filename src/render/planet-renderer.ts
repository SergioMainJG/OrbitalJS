import { type TrailPoint } from "@/types";

const PLANET_COLORS: Record<string, string> = {
  Sun: "#f97316",
  Mercury: "#9ca3af",
  Venus: "#facc15",
  Earth: "#3b82f6",
  Mars: "#ef4444",
};

const FALLBACK_COLOR = "#a8a8a8";

export const getPlanetColor = (name: string): string => {
  return PLANET_COLORS[name] ?? FALLBACK_COLOR;
};

export const getPlanetRadius = (mass: number): number => {
  return 2 + Math.log10(1 + mass * 1e6) * 3;
};

export const addTrailPoint = (
  trail: TrailPoint[],
  point: TrailPoint,
  maxLength: number,
): TrailPoint[] => {
  const next = [...trail, point];
  return next.length > maxLength ? next.slice(next.length - maxLength) : next;
};
