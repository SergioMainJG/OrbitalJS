import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { eulerStep } from "@/physics/euler-integrator";
import { rk4Step } from "@/physics/runge-kutta";
import { UNIVERSAL_CONSTS } from "@/constants";
import type { BodyState, ComparisonState, TrailPoint } from "@/types";

const { EULER_TRAIL_LENGTH, RK4_TRAIL_LENGTH } = UNIVERSAL_CONSTS;

export const SUN_EARTH_INITIAL: BodyState[] = [
  { name: "Sun", mass: 1, x: 0, y: 0, vx: 0, vy: 0 },
  {
    name: "Earth",
    mass: 3e-6,
    x: 1,
    y: 0,
    vx: 0,
    vy: (2 * Math.PI) / 365.25,
  },
];

const emptyTrails = (bodies: BodyState[]): TrailPoint[][] => bodies.map(() => []);

const makeInitialState = (): ComparisonState => ({
  eulerBodies: structuredClone(SUN_EARTH_INITIAL),
  rk4Bodies: structuredClone(SUN_EARTH_INITIAL),
  eulerTrails: emptyTrails(SUN_EARTH_INITIAL),
  rk4Trails: emptyTrails(SUN_EARTH_INITIAL),
  step: 0,
});

const [state, setState] = createStore<ComparisonState>(makeInitialState());

const [isComparing, setIsComparing] = createSignal(false);

export function tickComparison(dt = 1): void {
  setState(
    produce((s) => {
      const nextEuler = eulerStep(s.eulerBodies, dt);
      const nextRk4 = rk4Step(s.rk4Bodies, dt);

      for (let i = 0; i < nextEuler.length; i++) {
        const ep = nextEuler[i];
        const rp = nextRk4[i];
        if (!ep || !rp) continue;

        s.eulerTrails[i]!.push({ x: ep.x, y: ep.y });
        if (s.eulerTrails[i]!.length > EULER_TRAIL_LENGTH) {
          s.eulerTrails[i]!.splice(0, s.eulerTrails[i]!.length - EULER_TRAIL_LENGTH);
        }

        s.rk4Trails[i]!.push({ x: rp.x, y: rp.y });
        if (s.rk4Trails[i]!.length > RK4_TRAIL_LENGTH) {
          s.rk4Trails[i]!.splice(0, s.rk4Trails[i]!.length - RK4_TRAIL_LENGTH);
        }
      }

      s.eulerBodies = nextEuler;
      s.rk4Bodies = nextRk4;
      s.step += 1;
    }),
  );
}

export function resetComparison(): void {
  setState(makeInitialState());
}

export { state as comparisonState, isComparing, setIsComparing };
