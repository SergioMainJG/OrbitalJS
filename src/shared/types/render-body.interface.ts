import type { BodyState } from "./body-state.interface";

export interface RenderBody extends BodyState {
  radius: number;
  color: string;
  hohmannDv2Applied?: boolean;
  hohmannTargetR?: number;
  hohmannDv2Val?: number;
  hohmannDirection?: "out" | "in";
  hohmannPrevRadialVel?: number;
  launchedFrom?: string | undefined;
}
