import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import {
  tickComparison as tickComparisonEngine,
  makeEmptyComparisonState,
} from "@/core/engines/comparison-engine";
import { SUN_EARTH_SCENARIO } from "@/shared/scenarios/sun-earth.scenario";
import type { ComparisonState } from "@/shared/types";

// Export initial bodies from scenario for backward compatibility
export const SUN_EARTH_INITIAL = SUN_EARTH_SCENARIO.bodies;

const makeInitialState = (): ComparisonState => makeEmptyComparisonState(SUN_EARTH_SCENARIO.bodies);

const [state, setState] = createStore<ComparisonState>(makeInitialState());

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

export function resetComparison(): void {
  setState(makeInitialState());
}

export { state as comparisonState, isComparing, setIsComparing };
