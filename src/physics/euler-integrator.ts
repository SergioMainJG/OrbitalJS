import type { BodyState } from "@/types/body-state";

// Constante gravitacional universal
const G = (4 * Math.PI * Math.PI) / (365.25 * 365.25);

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

    //velocidad nueva = velocidad actual + aceleración × tiempo
    const vxNew = body.vx + ax * dt;
    const vyNew = body.vy + ay * dt;

    //posición nueva = posición actual + velocidad nueva × tiempo
    return {
      ...body,
      vx: vxNew,
      vy: vyNew,
      x: body.x + vxNew * dt,
      y: body.y + vyNew * dt,
    };
  });
}
