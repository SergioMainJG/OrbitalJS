/**
 * jpl-horizons-fetcher.ts
 *
 * Obtiene vectores de estado (posición + velocidad) desde la API pública
 * de JPL Horizons: https://ssd.jpl.nasa.gov/horizons/
 *
 * Endpoint usado: /api/telnet (formato VECTORS, heliocéntrico, J2000)
 * No requiere API key.
 */

import type { HorizonsRawResponse, HorizonsRequestParams } from "@/shared/types/horizons";

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const HORIZONS_BASE_URL = "https://ssd.jpl.nasa.gov/api/horizons.api";

/**
 * NAIF IDs de los planetas interiores.
 * El sufijo "99" denota el centroide del cuerpo (no el baricentro del sistema).
 * Centro: 10 = Sol (centroide)
 */
export const PLANET_NAIF_IDS = {
  mercury: "199",
  venus: "299",
  earth: "399",
  mars: "499",
} as const;

export type PlanetKey = keyof typeof PLANET_NAIF_IDS;

// ---------------------------------------------------------------------------
// Parámetros fijos de la consulta
// ---------------------------------------------------------------------------

/**
 * Construye los query params para Horizons en modo VECTORS.
 *
 * Documentación de parámetros:
 * https://ssd-api.jpl.nasa.gov/doc/horizons.html
 */
function buildQueryParams(params: HorizonsRequestParams): URLSearchParams {
  return new URLSearchParams({
    format: "text",
    COMMAND: `'${params.command}'`,
    OBJ_DATA: "YES", // incluye datos físicos del objeto
    MAKE_EPHEM: "YES",
    EPHEM_TYPE: "VECTORS", // tabla de vectores de estado
    CENTER: "'500@10'", // Sol, centroide (NAIF 10)
    REF_PLANE: "ECLIPTIC", // plano eclíptico J2000
    REF_SYSTEM: "J2000",
    COORD_TYPE: "GEODETIC",
    START_TIME: `'${params.startTime}'`,
    STOP_TIME: `'${params.stopTime}'`,
    STEP_SIZE: `'${params.stepSize}'`,
    VEC_TABLE: "2", // posición + velocidad (sin incertidumbres)
    VEC_CORR: "NONE",
    OUT_UNITS: "AU-D", // AU y AU/día → coherente con el motor RK4
    CSV_FORMAT: "NO",
    VEC_LABELS: "YES", // etiquetas X, Y, Z, VX, VY, VZ
    VEC_DELTA_T: "NO",
    ELM_LABELS: "YES",
    TP_TYPE: "ABSOLUTE",
    R_T_S_ONLY: "NO",
  });
}

// ---------------------------------------------------------------------------
// Función principal de fetch
// ---------------------------------------------------------------------------

/**
 * Obtiene el texto crudo de JPL Horizons para un cuerpo y época dados.
 *
 * @param naifId  - NAIF ID del cuerpo objetivo (e.g. "199" para Mercurio)
 * @param epoch   - Fecha en formato "YYYY-MMM-DD" (e.g. "2024-Jan-01")
 * @returns       - Respuesta cruda con el texto de Horizons y los parámetros usados
 * @throws        - Error con mensaje descriptivo si la petición falla
 */
export async function fetchHorizonsVector(
  naifId: string,
  epoch: string,
): Promise<HorizonsRawResponse> {
  const params: HorizonsRequestParams = {
    command: naifId,
    startTime: epoch,
    // Horizons necesita start < stop; pedimos un día después para obtener 1 entrada
    stopTime: incrementDate(epoch),
    stepSize: "1d",
  };

  const url = `${HORIZONS_BASE_URL}?${buildQueryParams(params).toString()}`;

  let response: Response;

  try {
    response = await fetch(url);
  } catch (cause) {
    throw new Error(
      `[jpl-horizons-fetcher] Error de red al contactar JPL Horizons para NAIF ${naifId}: ${String(cause)}`,
      { cause: cause },
    );
  }

  if (!response.ok) {
    throw new Error(
      `[jpl-horizons-fetcher] HTTP ${response.status} para NAIF ${naifId}. URL: ${url}`,
    );
  }

  const raw = await response.text();

  // Horizons devuelve "$$SOE" ... "$$EOE" como delimitadores de la efeméride.
  // Si no aparecen, la respuesta es un error de la API (e.g. NAIF inválido).
  if (!raw.includes("$$SOE")) {
    throw new Error(
      `[jpl-horizons-fetcher] Respuesta inesperada de JPL Horizons para NAIF ${naifId}. ` +
        `Posible error: ${extractApiError(raw)}`,
    );
  }

  return { raw, params };
}

/**
 * Obtiene vectores de estado para todos los planetas interiores en paralelo.
 *
 * @param epoch - Fecha en formato "YYYY-MMM-DD"
 * @returns     - Map de PlanetKey → HorizonsRawResponse
 */
export async function fetchAllPlanets(epoch: string): Promise<Map<PlanetKey, HorizonsRawResponse>> {
  const entries = Object.entries(PLANET_NAIF_IDS) as [PlanetKey, string][];

  console.info(`[jpl-horizons-fetcher] Fetching ${entries.length} planets para época: ${epoch}`);

  const map = new Map<PlanetKey, HorizonsRawResponse>();

  for (const [key, naifId] of entries) {
    try {
      const raw = await fetchHorizonsVector(naifId, epoch);
      map.set(key, raw);
      console.info(`[jpl-horizons-fetcher] ✓ ${key} (NAIF ${naifId})`);
      // Evitar saturar la API de JPL (rate limit/concurrencia)
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(
        `[jpl-horizons-fetcher] ✗ ${String(error instanceof Error ? error.message : error)}`,
      );
    }
  }

  if (map.size === 0) {
    throw new Error("[jpl-horizons-fetcher] No se pudo obtener ningún planeta.");
  }

  return map;
}

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

/**
 * Suma un día a una fecha en formato "YYYY-MMM-DD".
 * Horizons exige start < stop para generar al menos 1 vector.
 */
function incrementDate(epoch: string): string {
  // Formato de entrada: "2024-Jan-01"
  // Meses abreviados en inglés tal como los acepta Horizons
  const MONTHS: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const parts = epoch.split("-");
  const yearStr = parts[0] ?? "";
  const monthStr = parts[1] ?? "";
  const dayStr = parts[2] ?? "";

  const year = parseInt(yearStr, 10);
  const month = MONTHS[monthStr] ?? 0;
  const day = parseInt(dayStr, 10);

  const date = new Date(Date.UTC(year, month, day));
  date.setUTCDate(date.getUTCDate() + 1);

  const y = date.getUTCFullYear();
  const m = MONTH_NAMES[date.getUTCMonth()];
  const d = String(date.getUTCDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

/**
 * Extrae el mensaje de error que devuelve Horizons cuando la petición
 * es inválida (aparece en la línea que comienza con "!$$SOF").
 */
function extractApiError(raw: string): string {
  const errorLine = raw.split("\n").find((line) => line.startsWith("!") || line.includes("ERROR"));

  return errorLine?.trim() ?? "error desconocido (revisar respuesta cruda)";
}
