/* eslint-disable */
/* oxlint-disable */
import { describe, expect, it } from "vitest";
import { addTrailPoint, getPlanetColor, getPlanetRadius } from "@/render/planet-renderer";
import type { TrailPoint } from "@/types";

describe("getPlanetColor", () => {
  it("returns orange for the Sun", () => {
    expect(getPlanetColor("Sun")).toBe("#f97316");
  });

  it("returns gray for Mercury", () => {
    expect(getPlanetColor("Mercury")).toBe("#9ca3af");
  });

  it("returns yellow for Venus", () => {
    expect(getPlanetColor("Venus")).toBe("#facc15");
  });

  it("returns blue for Earth", () => {
    expect(getPlanetColor("Earth")).toBe("#3b82f6");
  });

  it("returns red for Mars", () => {
    expect(getPlanetColor("Mars")).toBe("#ef4444");
  });

  it("returns a non-empty string for an unknown body name", () => {
    const color = getPlanetColor("Unknown");
    expect(typeof color).toBe("string");
    expect(color.length).toBeGreaterThan(0);
  });

  it("all five known bodies have unique colors", () => {
    const colors = ["Sun", "Mercury", "Venus", "Earth", "Mars"].map(getPlanetColor);
    expect(new Set(colors).size).toBe(5);
  });

  it("returns a consistent color on repeated calls for the same planet", () => {
    expect(getPlanetColor("Earth")).toBe(getPlanetColor("Earth"));
  });
});

describe("getPlanetRadius", () => {
  it("returns a positive radius for any positive mass", () => {
    expect(getPlanetRadius(3e-6)).toBeGreaterThan(0);
    expect(getPlanetRadius(1)).toBeGreaterThan(0);
    expect(getPlanetRadius(1e-8)).toBeGreaterThan(0);
  });

  it("the sun has a larger radius than the earth", () => {
    expect(getPlanetRadius(1)).toBeGreaterThan(getPlanetRadius(3e-6));
  });

  it("radius grows monotonically with mass", () => {
    expect(getPlanetRadius(1)).toBeGreaterThan(getPlanetRadius(0.01));
    expect(getPlanetRadius(0.01)).toBeGreaterThan(getPlanetRadius(1e-6));
  });

  it("radius grows sub-linearly (logarithmic scale, not linear)", () => {
    const r1 = getPlanetRadius(1);
    const r100 = getPlanetRadius(100);
    expect(r100 / r1).toBeLessThan(100);
  });

  it("returns the same radius on repeated calls for the same mass", () => {
    expect(getPlanetRadius(3e-6)).toBe(getPlanetRadius(3e-6));
  });
});

describe("addTrailPoint", () => {
  it("adds a point to an empty trail", () => {
    const result = addTrailPoint([], { x: 1, y: 2 }, 200);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ x: 1, y: 2 });
  });

  it("appends the new point at the end of the trail", () => {
    const trail: TrailPoint[] = [{ x: 0, y: 0 }];
    const result = addTrailPoint(trail, { x: 5, y: 5 }, 200);
    expect(result[result.length - 1]).toEqual({ x: 5, y: 5 });
  });

  it("does not exceed the specified maximum trail length", () => {
    const trail: TrailPoint[] = Array.from({ length: 200 }, (_, i) => ({ x: i, y: 0 }));
    const result = addTrailPoint(trail, { x: 200, y: 0 }, 200);
    expect(result).toHaveLength(200);
  });

  it("discards the oldest point when the trail is full", () => {
    const trail: TrailPoint[] = Array.from({ length: 200 }, (_, i) => ({ x: i, y: 0 }));
    const result = addTrailPoint(trail, { x: 200, y: 0 }, 200);
    expect(result[0]).toEqual({ x: 1, y: 0 });
  });

  it("keeps the most recent point when the trail is full", () => {
    const trail: TrailPoint[] = Array.from({ length: 200 }, (_, i) => ({ x: i, y: 0 }));
    const result = addTrailPoint(trail, { x: 200, y: 0 }, 200);
    expect(result[result.length - 1]).toEqual({ x: 200, y: 0 });
  });

  it("does not mutate the original trail array", () => {
    const trail: TrailPoint[] = [{ x: 0, y: 0 }];
    addTrailPoint(trail, { x: 1, y: 1 }, 200);
    expect(trail).toHaveLength(1);
  });

  it("respects a maxLength smaller than the current trail size", () => {
    const trail: TrailPoint[] = Array.from({ length: 100 }, (_, i) => ({ x: i, y: 0 }));
    const result = addTrailPoint(trail, { x: 100, y: 0 }, 80);
    expect(result).toHaveLength(80);
  });

  it("keeps all points when the trail is shorter than maxLength", () => {
    const trail: TrailPoint[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ];
    const result = addTrailPoint(trail, { x: 2, y: 2 }, 200);
    expect(result).toHaveLength(3);
  });

  it("accumulates points correctly across multiple calls", () => {
    let trail: TrailPoint[] = [];
    for (let i = 0; i < 5; i++) {
      trail = addTrailPoint(trail, { x: i, y: 0 }, 200);
    }
    expect(trail).toHaveLength(5);
    expect(trail[trail.length - 1]).toEqual({ x: 4, y: 0 });
  });
});
