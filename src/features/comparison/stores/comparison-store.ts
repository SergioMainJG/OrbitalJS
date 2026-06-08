import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import {
  tickComparison as tickComparisonEngine,
  makeEmptyComparisonState,
} from "@/core/engines/comparison-engine";
import { SOLAR_SYSTEM_SCENARIO } from "@/shared/scenarios/solar-system.scenario";
import type { BodyState, ComparisonState } from "@/shared/types";

export const SOLAR_SYSTEM_INITIAL = SOLAR_SYSTEM_SCENARIO.bodies;

const makeInitialState = (bodies: BodyState[]): ComparisonState => makeEmptyComparisonState(bodies);

const [state, setState] = createStore<ComparisonState>(
  makeInitialState(SOLAR_SYSTEM_SCENARIO.bodies),
);

const [isComparing, setIsComparing] = createSignal(false);

export function tickComparison(dt = 1): void {
  setState(
    produce((s) => {
      const nextState = tickComparisonEngine(s, dt);
      s.eulerBodies = nextState.eulerBodies;
      s.rk4Bodies = nextState.rk4Bodies;
      s.eulerTrails = nextState.eulerTrails;
      s.rk4Trails = nextState.rk4Trails;
      s.step = nextState.step;
    }),
  );
}

/**
 * Initialize the comparison with the current simulation bodies.
 * Call this when enabling comparison mode so the overlay starts from the
 * same positions and velocities as the main simulation.
 */
export function initComparison(bodies: BodyState[]): void {
  setState(makeInitialState(bodies));
}

export function resetComparison(): void {
  setState(makeInitialState(SOLAR_SYSTEM_SCENARIO.bodies));
}

export { state as comparisonState, isComparing, setIsComparing };
