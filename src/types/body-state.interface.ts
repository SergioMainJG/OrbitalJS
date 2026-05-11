/**
 * @description Props for Body state
 * `name` is the name of the body
 * `mass` is the mass of the body in kg
 * `y` and `x` are the coords in AU
 * `vx` and `vy` are the components for velocity in AU/days
 */
export interface BodyState {
  name: string;
  mass: number;
  y: number;
  x: number;
  vy: number;
  vx: number;
}
