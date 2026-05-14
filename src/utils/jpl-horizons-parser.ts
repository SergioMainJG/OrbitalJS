/**
 * jpl-horizons-parser.ts
 *
 * Parsea la respuesta de texto de JPL Horizons (modo VECTORS, AU-D)
 * y extrae las condiciones iniciales listas para el motor RK4 de OrbitalJS.
 *
 * Formato de entrada (extracto relevante):
 *
 *   $$SOE
 *   2451544.500000000 = A.D. 2000-Jan-01 00:00:00.0000 TDB
 *    X = 3.544922285152766E-01  Y =-9.095671836820670E-02  Z =-3.668736474955671E-02
 *    VX= 3.983842486297610E-03  VY= 2.838909228781580E-02  VZ= 1.215896047571030E-03
 *    LT= 2.104688617042659E-03  RG= 3.643601498701429E-01  RR=-1.141413571985470E-02
 *   $$EOE
 */

import type {
  HorizonsRawResponse,
  PlanetInitialConditions,
  PlanetPhysics,
  StateVector,
} from "@/types/horizons";
import type { PlanetKey } from "@/utils/jpl-horizons-fetcher";

// ---------------------------------------------------------------------------
// Constantes físicas de los planetas interiores
// Fuente: NASA Planetary Fact Sheet
// GM en AU³/día² calculado como: GM_SI / (AU³/día²)
// Factor de conversión: 1 AU³/día² = 2.975919e-19 * m³/s²... mejor usar
// la tabla oficial de GM en km³/s² y convertir:
//   GM_AU_D2 = GM_km3_s2 * (s/día)^2 / (km/AU)^3
//   = GM_km3_s2 * 86400^2 / 1.495978707e8^3
// ---------------------------------------------------------------------------

const AU_KM = 1.495978707e8; // km por AU
const DAY_S = 86400; // segundos por día
const KM3_S2_TO_AU3_D2 = (DAY_S * DAY_S) / (AU_KM * AU_KM * AU_KM);

function gmToAuD2(gmKm3s2: number): number {
  return gmKm3s2 * KM3_S2_TO_AU3_D2;
}

/**
 * Propiedades físicas fijas por planeta.
 * GM oficial de IAU/JPL en km³/s².
 * Masa en kg según NASA Planetary Fact Sheet.
 */
const PLANET_PHYSICS: Record<PlanetKey, PlanetPhysics> = {
  mercury: {
    mass: 3.301e23,
    radiusKm: 2439.7,
    gm: gmToAuD2(22032.09),
  },
  venus: {
    mass: 4.8673e24,
    radiusKm: 6051.8,
    gm: gmToAuD2(324858.592),
  },
  earth: {
    mass: 5.9722e24,
    radiusKm: 6371.0,
    gm: gmToAuD2(398600.435),
  },
  mars: {
    mass: 6.4169e23,
    radiusKm: 3389.5,
    gm: gmToAuD2(42828.375),
  },
};

const PLANET_NAMES: Record<PlanetKey, string> = {
  mercury: "Mercury",
  venus: "Venus",
  earth: "Earth",
  mars: "Mars",
};

/**
 * Colores hex para renderizado en Canvas 2D.
 * Basados en la apariencia visual real de cada planeta.
 */
const PLANET_COLORS: Record<PlanetKey, string> = {
  mercury: "#b5b5b5", // gris rocoso
  venus: "#e8cda0", // dorado pálido / nubes de ácido sulfúrico
  earth: "#4fa3e0", // azul oceánico
  mars: "#c1440e", // rojo óxido de hierro
};

// ---------------------------------------------------------------------------
// Parser principal
// ---------------------------------------------------------------------------

/**
 * Parsea una HorizonsRawResponse y devuelve las condiciones iniciales
 * del planeta lisas para el motor de simulación.
 *
 * @param response - Respuesta cruda del fetcher
 * @param planetKey - Clave del planeta (para añadir metadatos y física)
 * @returns PlanetInitialConditions con vector de estado y física
 * @throws Error con mensaje descriptivo si el formato no coincide
 */
export function parseHorizonsResponse(
  response: HorizonsRawResponse,
  planetKey: PlanetKey,
): PlanetInitialConditions {
  const { raw, params } = response;

  const ephemerisBlock = extractEphemerisBlock(raw);
  const stateVector = parseStateVector(ephemerisBlock);
  const epoch = parseEpoch(ephemerisBlock);

  return {
    name: PLANET_NAMES[planetKey],
    naifId: params.command,
    epoch,
    stateVector,
    physics: PLANET_PHYSICS[planetKey],
    color: PLANET_COLORS[planetKey],
  };
}

// ---------------------------------------------------------------------------
// Helpers de parseo
// ---------------------------------------------------------------------------

/**
 * Extrae el bloque entre $$SOE y $$EOE del texto de Horizons.
 * Ese bloque contiene los vectores de estado para las épocas solicitadas.
 */
function extractEphemerisBlock(raw: string): string {
  const soeIndex = raw.indexOf("$$SOE");
  const eoeIndex = raw.indexOf("$$EOE");

  if (soeIndex === -1 || eoeIndex === -1) {
    throw new Error(
      "[jpl-horizons-parser] No se encontraron delimitadores $$SOE/$$EOE en la respuesta.",
    );
  }

  return raw.slice(soeIndex + "$$SOE".length, eoeIndex).trim();
}

/**
 * Parsea la línea de época del bloque de efemérides.
 * Formato: "2451544.500000000 = A.D. 2000-Jan-01 00:00:00.0000 TDB"
 *
 * @returns Fecha en formato ISO 8601 (e.g. "2000-01-01T00:00:00.000Z")
 */
function parseEpoch(block: string): string {
  // La primera línea no vacía es la época
  const epochLine = block.split("\n").find((line) => line.trim().length > 0);

  if (!epochLine) {
    throw new Error("[jpl-horizons-parser] No se encontró línea de época en el bloque $$SOE.");
  }

  // Extraer la parte "A.D. YYYY-Mon-DD HH:MM:SS.ssss TDB"
  const dateMatch = epochLine.match(
    /A\.D\.\s+(\d{4})-([A-Za-z]{3})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/,
  );

  if (!dateMatch) {
    throw new Error(`[jpl-horizons-parser] Formato de época no reconocido: "${epochLine.trim()}"`);
  }

  const year = dateMatch[1] ?? "";
  const monthStr = dateMatch[2] ?? "";
  const day = dateMatch[3] ?? "";
  const hour = dateMatch[4] ?? "";
  const minute = dateMatch[5] ?? "";
  const second = dateMatch[6] ?? "";

  const MONTH_MAP: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const month = MONTH_MAP[monthStr];

  if (!month) {
    throw new Error(`[jpl-horizons-parser] Mes desconocido en época: "${monthStr}"`);
  }

  return `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;
}

/**
 * Parsea las líneas X, Y, Z, VX, VY, VZ del bloque de efemérides.
 *
 * Formato esperado (una entrada, puede haber espacios variables):
 *   X = 3.544922E-01  Y =-9.095671E-02  Z =-3.668736E-02
 *   VX= 3.983842E-03  VY= 2.838909E-02  VZ= 1.215896E-03
 *
 * Horizons usa notación científica con E± siempre presente.
 */
function parseStateVector(block: string): StateVector {
  // Unir todo en una sola cadena para simplificar la búsqueda con regex
  const flat = block.replace(/\n/g, " ");

  /**
   * Extrae el valor numérico de un componente del vector.
   * El patrón acepta el signo pegado al '=' (e.g. "VX=-1.23E-04")
   * o con espacio (e.g. "X = 3.54E-01").
   */
  function extractComponent(label: string): number {
    // Escapa el label para usarlo en regex (VX, VY, VZ contienen nada especial, pero es buena práctica)
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`${escapedLabel}\\s*=\\s*([+-]?\\d+\\.\\d+[Ee][+-]?\\d+)`, "i");
    const match = flat.match(pattern);

    if (!match?.[1]) {
      throw new Error(
        `[jpl-horizons-parser] No se encontró el componente "${label}" en el bloque de vectores.`,
      );
    }

    const value = parseFloat(match[1]);

    if (!Number.isFinite(value)) {
      throw new Error(`[jpl-horizons-parser] Valor no finito para "${label}": "${match[1]}"`);
    }

    return value;
  }

  return {
    x: extractComponent("X"),
    y: extractComponent("Y"),
    z: extractComponent("Z"),
    vx: extractComponent("VX"),
    vy: extractComponent("VY"),
    vz: extractComponent("VZ"),
  };
}
