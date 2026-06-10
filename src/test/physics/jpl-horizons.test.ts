/**
 * src/test/physics/jpl-horizons.test.ts
 *
 * Tests de integración ligera para el fetcher y el parser de JPL Horizons.
 * El fetch real se mockea — los tests son offline y deterministas.
 *
 * Módulos bajo test:
 *   @/utils/jpl-horizons-fetcher  → fetchHorizonsVector, fetchAllPlanets
 *   @/utils/jpl-horizons-parser   → parseHorizonsResponse
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchHorizonsVector,
  fetchAllPlanets,
  PLANET_NAIF_IDS,
} from "@/shared/utils/jpl-horizons-fetcher";
import { parseHorizonsResponse } from "@/shared/utils/jpl-horizons-parser";
import type { HorizonsRawResponse } from "@/shared/types/horizons";

// ---------------------------------------------------------------------------
// Fixtures — formato real de JPL Horizons (modo VECTORS, AU-D)
// ---------------------------------------------------------------------------

const EARTH_FIXTURE = `
*******************************************************************************
 Revised: April 12, 2021                 Earth                            399
*******************************************************************************
$$SOE
2451544.500000000 = A.D. 2000-Jan-01 00:00:00.0000 TDB
 X = 1.000000000000000E+00  Y = 0.000000000000000E+00  Z = 0.000000000000000E+00
 VX=-1.000000000000000E-04  VY= 1.720209895000000E-02  VZ= 0.000000000000000E+00
 LT= 5.775518331774374E-03  RG= 1.000000000000000E+00  RR=-2.577807458749987E-07
$$EOE
*******************************************************************************
`;

const MERCURY_FIXTURE = `
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

/** Respuesta sin el bloque $$SOE — simula error de la API */
const ERROR_FIXTURE = `
*******************************************************************************
 ERROR: Invalid target body specified.
*******************************************************************************
`;

// ---------------------------------------------------------------------------
// Helper
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

/** Crea un mock de Response que devuelve el texto dado */
function mockResponse(text: string, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 500,
    text: () => Promise.resolve(text),
  } as unknown as Response;
}

// ---------------------------------------------------------------------------
// fetchHorizonsVector
// ---------------------------------------------------------------------------

describe("fetchHorizonsVector", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("retorna HorizonsRawResponse cuando la API responde con $$SOE", async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse(EARTH_FIXTURE));

    const result = await fetchHorizonsVector("399", "2000-Jan-01");

    expect(result.raw).toContain("$$SOE");
    expect(result.params.command).toBe("399");
    expect(result.params.startTime).toBe("2000-Jan-01");
  });

  it("incluye stopTime un día después del epoch dado", async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse(EARTH_FIXTURE));

    const result = await fetchHorizonsVector("399", "2000-Jan-01");

    expect(result.params.stopTime).toBe("2000-Jan-02");
  });

  it("llama a fetch con la URL correcta del endpoint de Horizons", async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse(EARTH_FIXTURE));

    await fetchHorizonsVector("199", "2000-Jan-01");

    const calledUrl = vi.mocked(fetch).mock.calls[0]?.[0] as string;
    expect(calledUrl).toContain("jpl-cors-proxy.arce-roldan-sergio.workers.dev");
    expect(calledUrl).toContain("COMMAND");
    expect(calledUrl).toContain("199");
  });

  it("lanza error cuando la respuesta no contiene $$SOE", async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse(ERROR_FIXTURE));

    await expect(fetchHorizonsVector("999", "2000-Jan-01")).rejects.toThrow(/Respuesta inesperada/);
  });

  it("lanza error cuando fetch falla por red", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

    await expect(fetchHorizonsVector("399", "2000-Jan-01")).rejects.toThrow(/Error de red/);
  });

  it("lanza error cuando la respuesta HTTP no es ok", async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse("", false));

    await expect(fetchHorizonsVector("399", "2000-Jan-01")).rejects.toThrow(/HTTP 500/);
  });
});

// ---------------------------------------------------------------------------
// fetchAllPlanets
// ---------------------------------------------------------------------------

describe("fetchAllPlanets", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("retorna un Map con todos los planetas cuando todo va bien", async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse(EARTH_FIXTURE));

    const result = await fetchAllPlanets("2000-Jan-01");

    expect(result.size).toBe(Object.keys(PLANET_NAIF_IDS).length);
    expect(result.has("mercury")).toBe(true);
    expect(result.has("venus")).toBe(true);
    expect(result.has("earth")).toBe(true);
    expect(result.has("mars")).toBe(true);
  }, 15000);

  it("las claves del Map coinciden con PLANET_NAIF_IDS", async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse(EARTH_FIXTURE));

    const result = await fetchAllPlanets("2000-Jan-01");

    for (const key of Object.keys(PLANET_NAIF_IDS)) {
      expect(result.has(key as keyof typeof PLANET_NAIF_IDS)).toBe(true);
    }
  }, 15000);

  it("lanza error cuando todos los fetch fallan", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Network down"));

    await expect(fetchAllPlanets("2000-Jan-01")).rejects.toThrow(
      /No se pudo obtener ningún planeta/,
    );
  });

  it("retorna planetas parciales si solo algunos fetch fallan", async () => {
    let callCount = 0;
    vi.mocked(fetch).mockImplementation(() => {
      callCount++;
      // Solo el primero falla, los demás tienen $$SOE
      return Promise.resolve(
        callCount === 1 ? mockResponse(ERROR_FIXTURE) : mockResponse(EARTH_FIXTURE),
      );
    });

    const result = await fetchAllPlanets("2000-Jan-01");

    expect(result.size).toBe(Object.keys(PLANET_NAIF_IDS).length - 1);
  }, 15000);
});

// ---------------------------------------------------------------------------
// parseHorizonsResponse — integración fetcher + parser
// ---------------------------------------------------------------------------

describe("parseHorizonsResponse — integración con fixtures del fetcher", () => {
  it("parsea correctamente una respuesta de Tierra producida por el fetcher", () => {
    const response = makeResponse(EARTH_FIXTURE, "399");
    const result = parseHorizonsResponse(response, "earth");

    expect(result.name).toBe("Earth");
    expect(result.naifId).toBe("399");
    expect(result.stateVector.x).toBeCloseTo(1.0, 5);
    expect(result.stateVector.vy).toBeCloseTo(1.720209895e-2, 8);
    expect(result.epoch).toBe("2000-01-01T00:00:00.000Z");
  });

  it("parsea correctamente una respuesta de Mercurio producida por el fetcher", () => {
    const response = makeResponse(MERCURY_FIXTURE, "199");
    const result = parseHorizonsResponse(response, "mercury");

    expect(result.name).toBe("Mercury");
    expect(result.stateVector.x).toBeCloseTo(3.544922285152766e-1, 10);
    expect(result.stateVector.y).toBeCloseTo(-9.09567183682067e-2, 10);
    expect(result.stateVector.vx).toBeCloseTo(3.98384248629761e-3, 10);
  });

  it("el resultado incluye masa positiva y finita", () => {
    const result = parseHorizonsResponse(makeResponse(EARTH_FIXTURE, "399"), "earth");
    expect(result.physics.mass).toBeGreaterThan(0);
    expect(Number.isFinite(result.physics.mass)).toBe(true);
  });

  it("el color hex cumple el formato #rrggbb", () => {
    const earth = parseHorizonsResponse(makeResponse(EARTH_FIXTURE, "399"), "earth");
    const mercury = parseHorizonsResponse(makeResponse(MERCURY_FIXTURE, "199"), "mercury");
    expect(earth.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(mercury.color).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it("lanza error si el raw no contiene $$SOE", () => {
    expect(() => parseHorizonsResponse(makeResponse(ERROR_FIXTURE, "399"), "earth")).toThrow(
      /\$\$SOE/,
    );
  });
});
