/**
 * Tipos para la API JPL Horizons y condiciones iniciales planetarias.
 * Todos los valores siguen el sistema SI:
 *   - posición: AU (unidades astronómicas)
 *   - velocidad: AU/día
 *   - masa: kg
 */

// ---------------------------------------------------------------------------
// Respuesta cruda de la API
// ---------------------------------------------------------------------------

export type HorizonsFormat = "text" | "json";

export interface HorizonsRequestParams {
  /** NAIF ID del cuerpo objetivo (e.g. "199" = Mercurio) */
  command: string;
  /** Epoch de inicio en formato "YYYY-MMM-DD" */
  startTime: string;
  /** Epoch de fin (usamos el mismo día para una sola entrada) */
  stopTime: string;
  /** Paso de tiempo (no importa cuando queremos una sola época) */
  stepSize: string;
}

export interface HorizonsRawResponse {
  /** Texto completo devuelto por la API (formato VECTORS) */
  raw: string;
  /** Parámetros usados en la solicitud */
  params: HorizonsRequestParams;
}

// ---------------------------------------------------------------------------
// Condiciones iniciales parseadas
// ---------------------------------------------------------------------------

/** Vector de posición/velocidad en el plano eclíptico J2000 */
export interface StateVector {
  /** Posición X en AU */
  x: number;
  /** Posición Y en AU */
  y: number;
  /** Posición Z en AU */
  z: number;
  /** Velocidad X en AU/día */
  vx: number;
  /** Velocidad Y en AU/día */
  vy: number;
  /** Velocidad Z en AU/día */
  vz: number;
}

/** Constantes físicas de un planeta necesarias para la simulación */
export interface PlanetPhysics {
  /** Masa en kg */
  mass: number;
  /** Radio ecuatorial en km */
  radiusKm: number;
  /** Parámetro gravitacional estándar GM en AU³/día² */
  gm: number;
}

/** Condiciones iniciales completas de un planeta en una época dada */
export interface PlanetInitialConditions {
  /** Nombre legible del planeta */
  name: string;
  /** NAIF ID usado en Horizons */
  naifId: string;
  /** Época de referencia (ISO 8601) */
  epoch: string;
  /** Vector de estado heliocéntrico en J2000 */
  stateVector: StateVector;
  /** Propiedades físicas */
  physics: PlanetPhysics;
  /** Color hex para renderizado en Canvas 2D */
  color: string;
}

/** Resultado final del fetch + parse para todos los planetas */
export interface PlanetsData {
  /** Fecha y hora de generación del archivo */
  generatedAt: string;
  /** Época de referencia para todos los vectores */
  epoch: string;
  /** Marco de referencia */
  referenceFrame: "ECLIPJ2000";
  /** Centro del sistema de coordenadas */
  center: "Sun (body center)";
  /** Condiciones iniciales por planeta */
  planets: PlanetInitialConditions[];
}
