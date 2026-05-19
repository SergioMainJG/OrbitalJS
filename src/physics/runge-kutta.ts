import { UNIVERSAL_CONSTS } from "@/constants";
import type { BodyState, Derivative } from "@/types";

const { G } = UNIVERSAL_CONSTS;

const evalDerivatives = (state: BodyState[]): Derivative[] => {
  return state.map((body, i) => {
    let ax = 0;
    let ay = 0;

    for (let j = 0; j < state.length; j++) {
      if (i === j) continue;

      const dx = state[j]!.x - body.x;
      const dy = state[j]!.y - body.y;
      const distSq = dx * dx + dy * dy;
      if (distSq === 0) continue;
      const dist = Math.sqrt(distSq);
      const distCubed = distSq * dist;

      ax += (G * state[j]!.mass * dx) / distCubed;
      ay += (G * state[j]!.mass * dy) / distCubed;
    }

    return { dx: body.vx, dy: body.vy, dvx: ax, dvy: ay };
  });
};

const advance = (state: BodyState[], derivs: Derivative[], scale: number): BodyState[] =>
  state.map((body, i) => ({
    ...body,
    x: body.x + derivs[i]!.dx * scale,
    y: body.y + derivs[i]!.dy * scale,
    vx: body.vx + derivs[i]!.dvx * scale,
    vy: body.vy + derivs[i]!.dvy * scale,
  }));

export const rk4Step = (state: BodyState[], dt: number): BodyState[] => {
  const k1 = evalDerivatives(state);

  const s2 = advance(state, k1, dt / 2);
  const k2 = evalDerivatives(s2);

  const s3 = advance(state, k2, dt / 2);
  const k3 = evalDerivatives(s3);

  const s4 = advance(state, k3, dt);
  const k4 = evalDerivatives(s4);

  return state.map((body, i) => ({
    ...body,
    x: body.x + ((k1[i]!.dx + 2 * k2[i]!.dx + 2 * k3[i]!.dx + k4[i]!.dx) * dt) / 6,
    y: body.y + ((k1[i]!.dy + 2 * k2[i]!.dy + 2 * k3[i]!.dy + k4[i]!.dy) * dt) / 6,
    vx: body.vx + ((k1[i]!.dvx + 2 * k2[i]!.dvx + 2 * k3[i]!.dvx + k4[i]!.dvx) * dt) / 6,
    vy: body.vy + ((k1[i]!.dvy + 2 * k2[i]!.dvy + 2 * k3[i]!.dvy + k4[i]!.dvy) * dt) / 6,
  }));
};
