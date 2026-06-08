/**
 * Estado fisico de un cuerpo celeste.
 * Unidades: posicion AU, velocidad AU/dia, masa en masas solares.
 */
export interface BodyState {
  name: string;
  mass: number;
  y: number;
  x: number;
  vy: number;
  vx: number;
}
