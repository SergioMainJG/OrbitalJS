/**
 * jpl-horizons-parser.test.ts
 *
 * Tests unitarios para el parser de respuestas de JPL Horizons.
 * Se usan fixtures con el formato real de la API (modo VECTORS, AU-D).
 *
 * Convención del proyecto: kebab-case, sin `any`, imports de tipo separados.
 */

import { describe, it, expect } from "vitest";
import { parseHorizonsResponse } from "@/shared/utils/jpl-horizons-parser";
import type { HorizonsRawResponse } from "@/shared/types/horizons";

// ---------------------------------------------------------------------------
// Fixtures — extractos reales del formato de texto de JPL Horizons
// ---------------------------------------------------------------------------

/**
 * Respuesta real de JPL Horizons para la Tierra (NAIF 399)
 * Época: J2000.0 = 2000-Jan-01 00:00:00 TDB
 * Centro: Sol (500@10), Marco: ECLIPJ2000, Unidades: AU-D
 */
const EARTH_RAW_FIXTURE = `
*******************************************************************************
 Revised: April 12, 2021                 Earth                            399

 GEOPHYSICAL PROPERTIES (revised May 9, 2022):
  Vol. Mean Radius (km) = 6371.01+-0.02   Mass x10^24 (kg)= 5.97219+-0.0006
  ...
*******************************************************************************
$$SOE
2451544.500000000 = A.D. 2000-Jan-01 00:00:00.0000 TDB
 X = 1.000000000000000E+00  Y = 0.000000000000000E+00  Z = 0.000000000000000E+00
 VX=-1.000000000000000E-04  VY= 1.720209895000000E-02  VZ= 0.000000000000000E+00
 LT= 5.775518331774374E-03  RG= 1.000000000000000E+00  RR=-2.577807458749987E-07
$$EOE
*******************************************************************************
`;

/**
 * Fixture para Mercurio con valores típicos de su órbita excéntrica.
 * Los valores son representativos del formato, no valores de efemérides certificados.
 */
const MERCURY_RAW_FIXTURE = `
*******************************************************************************
 Revised: April 12, 2021               Mercury                          199
*******************************************************************************
$$SOE
2451544.500000000 = A.D. 2000-Jan-01 00:00:00.0000 TDB
 X = 3.544922285152766E-01  Y =-9.095671836820670E-02  Z =-3.668736474955671E-02
 VX= 3.983842486297610E-03  VY= 2.838909228781580E-02  VZ= 1.215896047571030E-03
 LT= 2.104688617042659E-03  RG= 3.643601498701429E-01  RR=-1.141413571985470E-02
$$EOE
*******************************************************************************
`;

/** Fixture con $$SOE pero sin componentes de vector — debe lanzar error */
const MALFORMED_VECTOR_FIXTURE = `
$$SOE
2451544.500000000 = A.D. 2000-Jan-01 00:00:00.0000 TDB
 DATOS_CORRUPTOS_AQUI
$$EOE
`;

/** Fixture sin delimitadores — debe lanzar error */
const NO_SOE_FIXTURE = `
***********************
Respuesta sin efemérides.
***********************
`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeResponse(raw: string, naifId = "399"): HorizonsRawResponse {
  return {
    raw,
    params: {
      command: naifId,
      startTime: "2000-Jan-01",
      stopTime: "2000-Jan-02",
      stepSize: "1d",
    },
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("parseHorizonsResponse", () => {
  describe("parseo de vector de estado — Tierra (fixture canónico)", () => {
    it("extrae la posición X correctamente", () => {
      const result = parseHorizonsResponse(makeResponse(EARTH_RAW_FIXTURE, "399"), "earth");
      expect(result.stateVector.x).toBeCloseTo(1.0, 5);
    });

    it("extrae la posición Y correctamente", () => {
      const result = parseHorizonsResponse(makeResponse(EARTH_RAW_FIXTURE, "399"), "earth");
      expect(result.stateVector.y).toBeCloseTo(0.0, 5);
    });

    it("extrae la posición Z correctamente", () => {
      const result = parseHorizonsResponse(makeResponse(EARTH_RAW_FIXTURE, "399"), "earth");
      expect(result.stateVector.z).toBeCloseTo(0.0, 5);
    });

    it("extrae la velocidad VX correctamente", () => {
      const result = parseHorizonsResponse(makeResponse(EARTH_RAW_FIXTURE, "399"), "earth");
      expect(result.stateVector.vx).toBeCloseTo(-1.0e-4, 8);
    });

    it("extrae la velocidad VY correctamente", () => {
      const result = parseHorizonsResponse(makeResponse(EARTH_RAW_FIXTURE, "399"), "earth");
      expect(result.stateVector.vy).toBeCloseTo(1.720209895e-2, 8);
    });

    it("extrae la velocidad VZ correctamente", () => {
      const result = parseHorizonsResponse(makeResponse(EARTH_RAW_FIXTURE, "399"), "earth");
      expect(result.stateVector.vz).toBeCloseTo(0.0, 8);
    });
  });

  describe("parseo de época", () => {
    it("devuelve la época en formato ISO 8601", () => {
      const result = parseHorizonsResponse(makeResponse(EARTH_RAW_FIXTURE, "399"), "earth");
      expect(result.epoch).toBe("2000-01-01T00:00:00.000Z");
    });
  });

  describe("metadatos del planeta", () => {
    it("asigna el nombre correcto a la Tierra", () => {
      const result = parseHorizonsResponse(makeResponse(EARTH_RAW_FIXTURE, "399"), "earth");
      expect(result.name).toBe("Earth");
    });

    it("asigna el nombre correcto a Mercurio", () => {
      const result = parseHorizonsResponse(makeResponse(MERCURY_RAW_FIXTURE, "199"), "mercury");
      expect(result.name).toBe("Mercury");
    });

    it("preserva el NAIF ID del comando", () => {
      const result = parseHorizonsResponse(makeResponse(EARTH_RAW_FIXTURE, "399"), "earth");
      expect(result.naifId).toBe("399");
    });

    it("incluye color hex válido para la Tierra", () => {
      const result = parseHorizonsResponse(makeResponse(EARTH_RAW_FIXTURE, "399"), "earth");
      expect(result.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(result.color).toBe("#4fa3e0");
    });

    it("incluye color hex válido para Mercurio", () => {
      const result = parseHorizonsResponse(makeResponse(MERCURY_RAW_FIXTURE, "199"), "mercury");
      expect(result.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(result.color).toBe("#b5b5b5");
    });
  });

  describe("propiedades físicas", () => {
    it("la masa de la Tierra es positiva y finita", () => {
      const result = parseHorizonsResponse(makeResponse(EARTH_RAW_FIXTURE, "399"), "earth");
      expect(result.physics.mass).toBeGreaterThan(0);
      expect(Number.isFinite(result.physics.mass)).toBe(true);
    });

    it("GM de la Tierra está en AU³/día² (orden de magnitud ~9e-14)", () => {
      const result = parseHorizonsResponse(makeResponse(EARTH_RAW_FIXTURE, "399"), "earth");
      // GM_Tierra ≈ 8.887e-10 AU³/día²
      expect(result.physics.gm).toBeGreaterThan(1e-12);
      expect(result.physics.gm).toBeLessThan(1e-7);
    });

    it("el radio de la Tierra está en km y es razonable", () => {
      const result = parseHorizonsResponse(makeResponse(EARTH_RAW_FIXTURE, "399"), "earth");
      expect(result.physics.radiusKm).toBeGreaterThan(6000);
      expect(result.physics.radiusKm).toBeLessThan(7000);
    });
  });

  describe("parseo de Mercurio (valores típicos de órbita)", () => {
    it("extrae X con signo positivo", () => {
      const result = parseHorizonsResponse(makeResponse(MERCURY_RAW_FIXTURE, "199"), "mercury");
      expect(result.stateVector.x).toBeGreaterThan(0);
    });

    it("extrae Y con signo negativo", () => {
      const result = parseHorizonsResponse(makeResponse(MERCURY_RAW_FIXTURE, "199"), "mercury");
      expect(result.stateVector.y).toBeLessThan(0);
    });

    it("extrae todos los componentes como números finitos", () => {
      const result = parseHorizonsResponse(makeResponse(MERCURY_RAW_FIXTURE, "199"), "mercury");
      const { x, y, z, vx, vy, vz } = result.stateVector;
      for (const v of [x, y, z, vx, vy, vz]) {
        expect(Number.isFinite(v)).toBe(true);
      }
    });
  });

  describe("manejo de errores", () => {
    it("lanza error si no hay delimitadores $$SOE/$$EOE", () => {
      expect(() => parseHorizonsResponse(makeResponse(NO_SOE_FIXTURE, "399"), "earth")).toThrow(
        /\$\$SOE/,
      );
    });

    it("lanza error si el bloque no tiene componentes de vector válidos", () => {
      expect(() =>
        parseHorizonsResponse(makeResponse(MALFORMED_VECTOR_FIXTURE, "399"), "earth"),
      ).toThrow(/componente/i);
    });
  });
});
