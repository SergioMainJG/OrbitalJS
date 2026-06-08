import type { BodyState } from "./body-state.interface";

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

/** Masa de la nave — insignificante frente a los planetas (en M☉) */
export const SPACESHIP_MASS = 1e-25;

/** Nombre único para identificar la nave en el array de BodyState */
export const SPACESHIP_NAME = "Spaceship";

/** Longitud máxima del trail de la nave (frames) */
export const SPACESHIP_TRAIL_LENGTH = 300;

/** Factor de escala del vector velocidad al dibujar la flecha (px por AU/día) */
export const VELOCITY_ARROW_SCALE = 60;

/** Factor de escala para reducir la velocidad de lanzamiento inicial a valores orbitables */
export const SPACESHIP_LAUNCH_SPEED_FACTOR = 0.05;

/** Radio de colisión de la nave en AU */
export const SPACESHIP_COLLISION_RADIUS_AU = 0.01;

/**
 * BUG-5 fix: collision radii in AU per body name, consistent with visual radii.
 * Replaces the broken `bodyRadiusAU = SPACESHIP_COLLISION_RADIUS_AU + body.mass * 1e-26` formula.
 */
export const BODY_COLLISION_RADII_AU: Record<string, number> = {
  Sun: 0.05,
  Mercury: 0.008,
  Venus: 0.015,
  Earth: 0.015,
  Mars: 0.01,
};

/**
 * Convierte el vector de drag en canvas (px) a velocidad inicial en AU/día.
 */
export function dragToVelocity(
  dragPx: { dx: number; dy: number },
  scale: number,
): { vx: number; vy: number } {
  return {
    vx: (dragPx.dx / scale) * SPACESHIP_LAUNCH_SPEED_FACTOR,
    vy: (-dragPx.dy / scale) * SPACESHIP_LAUNCH_SPEED_FACTOR,
  };
}

/**
 * Convierte coordenadas de canvas (px) a AU en el sistema heliocéntrico.
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
