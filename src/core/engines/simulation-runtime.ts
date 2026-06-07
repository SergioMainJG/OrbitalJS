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
