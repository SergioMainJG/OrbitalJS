export const COLORS = {
  euler: "#ef4444",
  rk4: "#3b82f6",
} as const;

export const SERIES_COLORS = {
  kinetic: "#facc15",
  potential: "#818cf8",
  total: "#34d399",
} as const;

// BUG FIX: Added outer planets + Pluto colors
export const PLANET_COLORS: Record<string, string> = {
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
} as const;

export const FALLBACK_COLOR = "#a8a8a8";
