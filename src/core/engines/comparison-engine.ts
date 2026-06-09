import { eulerStep } from "@/core/physics/euler-integrator";
import { rk4Step } from "@/core/physics/runge-kutta";
import { UNIVERSAL_CONSTS } from "@/shared/constants";
import type { BodyState, ComparisonState, TrailPoint } from "@/shared/types";

const { EULER_TRAIL_LENGTH, RK4_TRAIL_LENGTH } = UNIVERSAL_CONSTS;

/**
 * Advances both the Euler and RK4 shadow simulations by one step,
 * appending the new positions to their respective trail buffers.
 *
 * The comparison engine runs in parallel to the main RK4 simulation so that
 * the integrator divergence is visible in real time on the canvas.
 *
 * @param state - Current comparison state (both body arrays and trail buffers).
 * @param dt    - Time step in days (defaults to `1`).
 * @returns A new `ComparisonState` with updated bodies, trails, and incremented step counter.
 */
export function tickComparison(state: ComparisonState, dt = 1): ComparisonState {
  const nextEuler = eulerStep(state.eulerBodies, dt);
  const nextRk4 = rk4Step(state.rk4Bodies, dt);

  const eulerTrails = state.eulerTrails.map((trail, i) => {
    const ep = nextEuler[i];
    if (!ep) return trail;
    const updated = [...trail, { x: ep.x, y: ep.y }];
    return updated.length > EULER_TRAIL_LENGTH
      ? updated.slice(updated.length - EULER_TRAIL_LENGTH)
      : updated;
  });

  const rk4Trails = state.rk4Trails.map((trail, i) => {
    const rp = nextRk4[i];
    if (!rp) return trail;
    const updated = [...trail, { x: rp.x, y: rp.y }];
    return updated.length > RK4_TRAIL_LENGTH
      ? updated.slice(updated.length - RK4_TRAIL_LENGTH)
      : updated;
  });

  return {
    eulerBodies: nextEuler,
    rk4Bodies: nextRk4,
    eulerTrails,
    rk4Trails,
    step: state.step + 1,
  };
}

/**
 * Creates an initial `ComparisonState` by deep-cloning the current body array
 * for both integrators and initializing empty trail arrays.
 *
 * @param bodies - The canonical body states from the main simulation store.
 * @returns A fresh `ComparisonState` ready to be fed to `tickComparison`.
 */
export function makeEmptyComparisonState(bodies: BodyState[]): ComparisonState {
  return {
    eulerBodies: bodies.map((b) => ({ ...b })),
    rk4Bodies: bodies.map((b) => ({ ...b })),
    eulerTrails: bodies.map(() => [] as TrailPoint[]),
    rk4Trails: bodies.map(() => [] as TrailPoint[]),
    step: 0,
  };
}
