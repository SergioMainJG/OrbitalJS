import type { BodyState, TrailPoint } from "@/types";

export interface ComparisonState {
  eulerBodies: BodyState[];
  rk4Bodies: BodyState[];
  eulerTrails: TrailPoint[][];
  rk4Trails: TrailPoint[][];
  step: number;
}
