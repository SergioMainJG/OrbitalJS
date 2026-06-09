import { UNIVERSAL_CONSTS } from "@/shared/constants";
import type { BodyState } from "@/shared/types";

/** G in AU³ / (M☉ · day²). */
const { G } = UNIVERSAL_CONSTS;

/**
 * Advances the N-body system by one time step using the explicit Euler method.
 *
 * Each body's acceleration is computed from Newton's law of universal gravitation,
 * then positions are updated using the velocity from the *start* of the step
 * (not the newly computed one), keeping the method first-order accurate:
 * `v(t+dt) = v(t) + a(t)·dt`
 * `x(t+dt) = x(t) + v(t)·dt`
 *
 * Global error scales as O(dt), so this integrator accumulates significant
 * energy drift over long simulations — use RK4 for precise trajectories.
 *
 * @param state - Array of body states at time `t`.
 * @param dt    - Time step in days.
 * @returns Updated body states at time `t + dt`.
 */
export function eulerStep(state: BodyState[], dt: number): BodyState[] {
  return state.map((body, i) => {
    let ax = 0;
    let ay = 0;

    for (let j = 0; j < state.length; j++) {
      if (i === j) continue;
      const other = state[j];
      if (!other) continue;

      const dx = other.x - body.x;
      const dy = other.y - body.y;

      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist === 0) continue;
      const dist3 = dist * dist * dist;

      // a_i += G * m_j * (r_j - r_i) / |r_j - r_i|^3
      ax += (G * other.mass * dx) / dist3;
      ay += (G * other.mass * dy) / dist3;
    }

    return {
      ...body,
      vx: body.vx + ax * dt,
      vy: body.vy + ay * dt,
      x: body.x + body.vx * dt, // ← velocidad ANTERIOR
      y: body.y + body.vy * dt, // ← velocidad ANTERIOR
    };
  });
}
