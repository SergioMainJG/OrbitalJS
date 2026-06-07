import { UNIVERSAL_CONSTS } from "@/shared/constants";
import type { BodyState } from "@/shared/types";

const { G } = UNIVERSAL_CONSTS;

export function eulerStep(state: BodyState[], dt: number): BodyState[] {
  return state.map((body, i) => {
    //Aceleración total que recibe este cuerpo de todos los demás
    let ax = 0;
    let ay = 0;

    for (let j = 0; j < state.length; j++) {
      if (i === j) continue;
      const other = state[j];
      if (!other) continue;

      //Vector distancia que va de body hacia other
      const dx = other.x - body.x;
      const dy = other.y - body.y;

      //Distancia en metros entre los dos cuerpos
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist === 0) continue; // evita división por cero
      //dist^3 para aplicar la ley de gravedad y normalizar el vector dirección
      const dist3 = dist * dist * dist;

      // a_i += G * m_j * (r_j - r_i) / |r_j - r_i|^3
      ax += (G * other.mass * dx) / dist3;
      ay += (G * other.mass * dy) / dist3;
    }

    //posición nueva = posición actual + velocidad nueva × tiempo
    return {
      ...body,
      vx: body.vx + ax * dt,
      vy: body.vy + ay * dt,
      x: body.x + body.vx * dt, // ← velocidad ANTERIOR
      y: body.y + body.vy * dt, // ← velocidad ANTERIOR
    };
  });
}
