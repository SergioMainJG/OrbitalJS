import type { BodyState } from "@/shared/types";
import { PhysicsEngine, type IntegratorName } from "./physics-engine";

export class SimulationRuntime {
  private readonly physicsEngine = new PhysicsEngine();

  setIntegrator(integrator: IntegratorName): void {
    this.physicsEngine.setIntegrator(integrator);
  }

  tick(state: BodyState[], dt: number): BodyState[] {
    return this.physicsEngine.step(state, dt);
  }
}

/**
 * Instancia singleton compartida por solar-system-canvas y simulation-controls.
 * Garantiza que ambos usen el mismo motor y el mismo integrador activo.
 */
export const simulationRuntime = new SimulationRuntime();
