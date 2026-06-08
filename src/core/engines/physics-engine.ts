import { eulerStep } from "@/core/physics/euler-integrator";
import { rk4Step } from "@/core/physics/runge-kutta";
import type { BodyState } from "@/shared/types";

export type IntegratorName = "RK4" | "Euler";

export class PhysicsEngine {
  private integrator: IntegratorName = "RK4";

  setIntegrator(name: IntegratorName): void {
    this.integrator = name;
  }

  step(state: BodyState[], dt: number): BodyState[] {
    return this.integrator === "RK4" ? rk4Step(state, dt) : eulerStep(state, dt);
  }
}
