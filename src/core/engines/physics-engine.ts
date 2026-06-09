import { eulerStep } from "@/core/physics/euler-integrator";
import { rk4Step } from "@/core/physics/runge-kutta";
import type { BodyState } from "@/shared/types";

/** Name of the numerical integration algorithm to use. */
export type IntegratorName = "RK4" | "Euler";

/**
 * Thin wrapper around the available integrators.
 * Allows switching between Euler and RK4 at runtime without changing call sites.
 */
export class PhysicsEngine {
  private integrator: IntegratorName = "RK4";

  /**
   * Switches the active numerical integrator.
   *
   * @param name - `"RK4"` for 4th-order Runge-Kutta or `"Euler"` for explicit Euler.
   */
  setIntegrator(name: IntegratorName): void {
    this.integrator = name;
  }

  /**
   * Advances the simulation by one time step using the active integrator.
   *
   * @param state - Current body states.
   * @param dt    - Time step in days.
   * @returns New body states at `t + dt`.
   */
  step(state: BodyState[], dt: number): BodyState[] {
    return this.integrator === "RK4" ? rk4Step(state, dt) : eulerStep(state, dt);
  }
}
