import type { BodyState } from "./body-state.interface";

/**
 * Extends `BodyState` with presentation-layer properties required by the Canvas renderer,
 * and optional Hohmann-transfer state used by the physics update loop.
 */
export interface RenderBody extends BodyState {
  /** Visual radius in canvas pixels. */
  radius: number;
  /** CSS hex color string used when drawing this body. */
  color: string;
  /** `false` until the second Hohmann burn (Δv₂) has been applied. */
  hohmannDv2Applied?: boolean;
  /** Target orbital radius in AU for the second Hohmann burn. */
  hohmannTargetR?: number;
  /** Magnitude of the second Hohmann delta-v in AU/day. */
  hohmannDv2Val?: number;
  /** Whether the transfer orbit goes outward (`"out"`) or inward (`"in"`). */
  hohmannDirection?: "out" | "in";
  /** Radial velocity from the previous frame, used to detect apoapsis/periapsis crossing. */
  hohmannPrevRadialVel?: number;
  /** Name of the body this spacecraft was launched from. Cleared once the ship has escaped its gravitational influence. */
  launchedFrom?: string | undefined;
}
