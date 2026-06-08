import { PLANET_COLORS, FALLBACK_COLOR } from "@/shared/constants";

export const getPlanetColor = (name: string): string => {
  return PLANET_COLORS[name] ?? FALLBACK_COLOR;
};

export const getPlanetRadius = (mass: number): number => {
  return 2 + Math.log10(1 + mass * 1e6) * 3;
};
