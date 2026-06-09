import type { BodyState } from "@/shared/types";
import { PhysicsEngine, type IntegratorName } from "./physics-engine";

/**
 * Facade over `PhysicsEngine` that provides a clean `tick()` API to the
 * presentation layer, hiding the integrator selection detail.
 */
export class SimulationRuntime {
  private readonly physicsEngine = new PhysicsEngine();

  /**
   * Switches the numerical integrator used on the next `tick()`.
   *
   * @param integrator - `"RK4"` or `"Euler"`.
   */
  setIntegrator(integrator: IntegratorName): void {
    this.physicsEngine.setIntegrator(integrator);
  }

  /**
   * Advances the simulation by one time step.
   *
   * @param state - Current body states.
   * @param dt    - Time step in days.
   * @returns New body states at `t + dt`.
   */
  tick(state: BodyState[], dt: number): BodyState[] {
    return this.physicsEngine.step(state, dt);
  }
}

/**
 * Singleton shared by `solar-system-canvas` and `simulation-controls`.
 * Guarantees both use the same engine and the same active integrator.
 */
export const simulationRuntime = new SimulationRuntime();
