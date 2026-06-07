#!/usr/bin/env bun
/**
 * scripts/fetch-planets.ts
 *
 * Script de Node/Bun para obtener las condiciones iniciales de Mercurio,
 * Venus, Tierra y Marte desde JPL Horizons y escribirlas en:
 *   src/data/planets.json
 *
 * Uso:
 *   bun run scripts/fetch-planets.ts
 *   bun run scripts/fetch-planets.ts --epoch 2024-Jan-01
 *
 * El archivo generado es la fuente de verdad para el motor RK4.
 * Volver a correrlo actualiza los datos sin tocar el código de simulación.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { fetchAllPlanets, PLANET_NAIF_IDS } from "@/shared/utils/jpl-horizons-fetcher";
import { parseHorizonsResponse } from "@/shared/utils/jpl-horizons-parser";
import type { PlanetKey } from "@/shared/utils/jpl-horizons-fetcher";
import type { PlanetInitialConditions, PlanetsData } from "@/shared/types/horizons";

// ---------------------------------------------------------------------------
// Configuración
// ---------------------------------------------------------------------------

const dir = dirname(fileURLToPath(import.meta.url));

/** Época por defecto: J2000.0 (referencia estándar de astrometría) */
const DEFAULT_EPOCH = "2000-Jan-01";
const OUTPUT_PATH = join(dir, "..", "data", "planets.json");

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const epoch = parseCliEpoch() ?? DEFAULT_EPOCH;

  console.info("╔══════════════════════════════════════════════════╗");
  console.info("║          OrbitalJS — JPL Horizons Fetcher        ║");
  console.info("╚══════════════════════════════════════════════════╝");
  console.info(`  Época  : ${epoch}`);
  console.info(`  Output : ${OUTPUT_PATH}`);
  console.info("  Planetas: Mercurio, Venus, Tierra, Marte\n");

  // 1. Fetch en paralelo
  const rawResponses = await fetchAllPlanets(epoch);

  // 2. Parsear cada respuesta
  const planets = [] as PlanetsData["planets"];

  for (const [key, raw] of rawResponses) {
    const planetKey = key as PlanetKey;
    try {
      const conditions = parseHorizonsResponse(raw, planetKey);
      planets.push(conditions);
      console.info(`  ✓ Parseado: ${conditions.name} — época ${conditions.epoch}`);
    } catch (err) {
      console.error(`  ✗ Error parseando ${key}: ${String(err)}`);
    }
  }

  if (planets.length === 0) {
    console.error("\n[fetch-planets] No se generaron datos. Abortando.");
    process.exit(1);
  }

  // Ordenar por NAIF ID para consistencia en el JSON
  planets.sort(
    (a: PlanetInitialConditions, b: PlanetInitialConditions) => Number(a.naifId) - Number(b.naifId),
  );

  // 3. Construir objeto final
  const output: PlanetsData = {
    generatedAt: new Date().toISOString(),
    epoch,
    referenceFrame: "ECLIPJ2000",
    center: "Sun (body center)",
    planets,
  };

  // 4. Escribir a disco
  await mkdir(join(dir, "..", "data"), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");

  const totalPlanets = Object.keys(PLANET_NAIF_IDS).length;
  console.info(`\n✅ planets.json generado — ${planets.length}/${totalPlanets} planetas`);
  console.info(`   → ${OUTPUT_PATH}`);
}

// ---------------------------------------------------------------------------
// CLI helper
// ---------------------------------------------------------------------------

/**
 * Lee --epoch YYYY-Mon-DD de los argumentos de línea de comandos.
 * Valida el formato antes de devolverlo.
 */
function parseCliEpoch(): string | null {
  const args = process.argv.slice(2);
  const epochIndex = args.indexOf("--epoch");

  if (epochIndex === -1) return null;

  const value = args[epochIndex + 1];

  if (!value) {
    console.warn("[fetch-planets] --epoch requiere un valor. Usando época por defecto.");
    return null;
  }

  // Formato esperado: YYYY-Mon-DD (e.g. "2024-Jan-01")
  const EPOCH_REGEX = /^\d{4}-[A-Z][a-z]{2}-\d{2}$/;

  if (!EPOCH_REGEX.test(value)) {
    console.warn(
      `[fetch-planets] Formato de época inválido: "${value}". ` +
        `Formato esperado: YYYY-Mon-DD (e.g. 2024-Jan-01). Usando época por defecto.`,
    );
    return null;
  }

  return value;
}

// ---------------------------------------------------------------------------
// Ejecutar
// ---------------------------------------------------------------------------

main().catch((err: unknown) => {
  console.error("\n[fetch-planets] Error fatal:", err);
  process.exit(1);
});
