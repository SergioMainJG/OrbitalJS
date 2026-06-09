/**
 * Rate-of-change vector produced by the derivative evaluator in the RK4 integrator.
 * Each component is the time-derivative of the corresponding `BodyState` field.
 */
export interface Derivative {
  /** Rate of change of x position: dx/dt = vx (AU/day). */
  dx: number;
  /** Rate of change of y position: dy/dt = vy (AU/day). */
  dy: number;
  /** Rate of change of x velocity: dvx/dt = ax (AU/day²). */
  dvx: number;
  /** Rate of change of y velocity: dvy/dt = ay (AU/day²). */
  dvy: number;
}
