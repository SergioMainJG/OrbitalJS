// /* eslint-disable */
// /* prettier-ignore */
import { describe, expect, it } from "vitest";
import { eulerStep } from "@/core/physics/euler-integrator";
import { rk4Step } from "@/core/physics/runge-kutta";
import { COLORS } from "@/shared/constants/colors.config";
import { STYLES } from "@/shared/constants/styles.config";
import { UNIVERSAL_CONSTS } from "@/shared/constants/constants.config";
import type { BodyState, TrailPoint } from "@/shared/types";

const { EULER_TRAIL_LENGTH } = UNIVERSAL_CONSTS;

const sunEarthSystem = (): BodyState[] => [
  { name: "Sun", mass: 1, x: 0, y: 0, vx: 0, vy: 0 },
  { name: "Earth", mass: 3e-6, x: 1, y: 0, vx: 0, vy: (2 * Math.PI) / 365.25 },
];

describe("Euler vs RK4 comparison mode", () => {
  describe("initial conditions", () => {
    it("both integrators start at identical positions", () => {
      const euler = sunEarthSystem();
      const rk4 = sunEarthSystem();
      expect(euler[1]!.x).toBe(rk4[1]!.x);
      expect(euler[1]!.y).toBe(rk4[1]!.y);
    });

    it("both integrators start with identical velocities", () => {
      const euler = sunEarthSystem();
      const rk4 = sunEarthSystem();
      expect(euler[1]!.vx).toBe(rk4[1]!.vx);
      expect(euler[1]!.vy).toBe(rk4[1]!.vy);
    });
  });

  describe("numerical divergence", () => {
    it("euler diverges visibly from rk4 after 500 steps with dt=1", () => {
      let euler = sunEarthSystem();
      let rk4 = sunEarthSystem();

      for (let i = 0; i < 500; i++) {
        euler = eulerStep(euler, 1);
        rk4 = rk4Step(rk4, 1);
      }

      const dx = euler[1]!.x - rk4[1]!.x;
      const dy = euler[1]!.y - rk4[1]!.y;
      expect(Math.sqrt(dx * dx + dy * dy)).toBeGreaterThan(0.1);
    });

    it("rk4 orbital radius drifts less than euler after 500 steps", () => {
      let euler = sunEarthSystem();
      let rk4 = sunEarthSystem();

      for (let i = 0; i < 500; i++) {
        euler = eulerStep(euler, 1);
        rk4 = rk4Step(rk4, 1);
      }

      const eulerDist = Math.sqrt(euler[1]!.x ** 2 + euler[1]!.y ** 2);
      const rk4Dist = Math.sqrt(rk4[1]!.x ** 2 + rk4[1]!.y ** 2);
      expect(Math.abs(rk4Dist - 1)).toBeLessThan(Math.abs(eulerDist - 1));
    });

    it("after just 10 steps the two integrators already differ slightly", () => {
      let euler = sunEarthSystem();
      let rk4 = sunEarthSystem();

      for (let i = 0; i < 10; i++) {
        euler = eulerStep(euler, 1);
        rk4 = rk4Step(rk4, 1);
      }

      const dx = euler[1]!.x - rk4[1]!.x;
      const dy = euler[1]!.y - rk4[1]!.y;
      expect(Math.sqrt(dx * dx + dy * dy)).toBeGreaterThan(0);
    });
  });

  describe("COLORS config", () => {
    it("euler is assigned a red color", () => {
      expect(COLORS.euler).toBe("#ef4444");
    });

    it("rk4 is assigned a blue color", () => {
      expect(COLORS.rk4).toBe("#3b82f6");
    });

    it("euler and rk4 colors are distinct", () => {
      expect(COLORS.euler).not.toBe(COLORS.rk4);
    });
  });

  describe("STYLES config", () => {
    it("euler uses a dashed line to signal instability", () => {
      expect(STYLES.euler.dashed).toBe(true);
    });

    it("rk4 uses a solid line to signal stability", () => {
      expect(STYLES.rk4.dashed).toBe(false);
    });

    it("both integrators share the same line width", () => {
      expect(STYLES.euler.lineWidth).toBe(STYLES.rk4.lineWidth);
    });

    it("line width is a positive number", () => {
      expect(STYLES.rk4.lineWidth).toBeGreaterThan(0);
    });
  });

  describe("trail length", () => {
    it("EULER_TRAIL_LENGTH is 80", () => {
      expect(EULER_TRAIL_LENGTH).toBe(80);
    });

    it("euler trail is shorter than the rk4 maximum of 200", () => {
      expect(EULER_TRAIL_LENGTH).toBeLessThan(200);
    });

    it("slicing a trail to EULER_TRAIL_LENGTH keeps the most recent points", () => {
      const trail: TrailPoint[] = Array.from({ length: 100 }, (_, i) => ({ x: i, y: i }));
      const truncated = trail.slice(-EULER_TRAIL_LENGTH);
      expect(truncated).toHaveLength(EULER_TRAIL_LENGTH);
      expect(truncated[truncated.length - 1]).toEqual({ x: 99, y: 99 });
    });

    it("slicing a trail shorter than EULER_TRAIL_LENGTH returns all points unchanged", () => {
      const trail: TrailPoint[] = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ];
      expect(trail.slice(-EULER_TRAIL_LENGTH)).toHaveLength(2);
    });
  });

  describe("ComparisonState structure", () => {
    it("comparison state holds separate trail arrays for euler and rk4", () => {
      const state = {
        eulerBodies: sunEarthSystem(),
        rk4Bodies: sunEarthSystem(),
        eulerTrails: [[], []] as TrailPoint[][],
        rk4Trails: [[], []] as TrailPoint[][],
        step: 0,
      };
      expect(state.eulerTrails).toHaveLength(2);
      expect(state.rk4Trails).toHaveLength(2);
      expect(state.step).toBe(0);
    });

    it("step counter increments represent one day of simulation", () => {
      let step = 0;
      let euler = sunEarthSystem();
      let rk4 = sunEarthSystem();

      for (let i = 0; i < 10; i++) {
        euler = eulerStep(euler, 1);
        rk4 = rk4Step(rk4, 1);
        step++;
      }

      expect(step).toBe(10);
    });
  });
});
