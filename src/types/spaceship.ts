import type { BodyState } from "@/types";

// ---------------------------------------------------------------------------
// Estado del lanzador (máquina de estados simple)
// ---------------------------------------------------------------------------

/** Fase del gesto de lanzamiento */
export type LaunchPhase =
  | "idle" // sin interacción
  | "aiming" // mousedown presionado, arrastrando para definir velocidad
  | "launched"; // nave en vuelo, integrada por RK4

export interface LaunchState {
  phase: LaunchPhase;
  /** Posición inicial en coordenadas de canvas (px) donde hizo mousedown */
  originCanvas: { x: number; y: number } | null;
  /** Posición actual del mouse en canvas (px) mientras arrastra */
  currentCanvas: { x: number; y: number } | null;
}

// ---------------------------------------------------------------------------
// Nave en vuelo
// ---------------------------------------------------------------------------

/** Masa de la nave — insignificante frente a los planetas (en kg) */
export const SPACESHIP_MASS = 1e3;

/** Nombre único para identificar la nave en el array de BodyState */
export const SPACESHIP_NAME = "Spaceship";

/** Longitud máxima del trail de la nave (frames) */
export const SPACESHIP_TRAIL_LENGTH = 300;

/** Factor de escala del vector velocidad al dibujar la flecha (px por AU/día) */
export const VELOCITY_ARROW_SCALE = 60;

/** Radio de colisión de la nave en AU — se usa para detección de impacto */
export const SPACESHIP_COLLISION_RADIUS_AU = 0.01;

/**
 * Convierte el vector de drag en canvas (px) a velocidad inicial en AU/día.
 * El drag va desde originCanvas hasta currentCanvas.
 *
 * @param dragPx  - Vector de drag en píxeles { dx, dy }
 * @param scale   - Escala actual del canvas en px/AU
 * @returns       - Velocidad inicial { vx, vy } en AU/día
 */
export function dragToVelocity(
  dragPx: { dx: number; dy: number },
  scale: number,
): { vx: number; vy: number } {
  // Invertimos Y porque canvas tiene Y hacia abajo y la simulación Y hacia arriba
  return {
    vx: dragPx.dx / scale,
    vy: -dragPx.dy / scale,
  };
}

/**
 * Convierte coordenadas de canvas (px) a AU en el sistema heliocéntrico.
 *
 * @param canvasPx - Posición en canvas { x, y }
 * @param cx       - Centro del canvas en px (width/2)
 * @param cy       - Centro del canvas en px (height/2)
 * @param scale    - Escala actual del canvas en px/AU
 * @returns        - Posición en AU { x, y }
 */
export function canvasToAU(
  canvasPx: { x: number; y: number },
  cx: number,
  cy: number,
  scale: number,
): { x: number; y: number } {
  return {
    x: (canvasPx.x - cx) / scale,
    y: -(canvasPx.y - cy) / scale,
  };
}

/**
 * Crea un BodyState para la nave lista para el integrador RK4.
 */
export function createSpaceshipBody(
  posAU: { x: number; y: number },
  velAUDay: { vx: number; vy: number },
): BodyState {
  return {
    name: SPACESHIP_NAME,
    mass: SPACESHIP_MASS,
    x: posAU.x,
    y: posAU.y,
    vx: velAUDay.vx,
    vy: velAUDay.vy,
  };
}
