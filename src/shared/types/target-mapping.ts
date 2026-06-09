/**
 * Types derived from `target-mapping.json`.
 *
 * The mapping file is the single source of truth for all bodies known to
 * OrbitalJS. The fetcher reads it at runtime; the parser and the renderer use
 * the fields it exposes without knowing about Horizons query details.
 */

// ---------------------------------------------------------------------------
// Body classification
// ---------------------------------------------------------------------------

/**
 * Physical classification of a body, aligned with the `BodyType` enum in
 * `celestial-body.ts`. `DwarfPlanet` is added here to distinguish IAU-classified
 * dwarf planets (Pluto, Ceres, Eris…) from true planets in the catalog.
 */
export type TargetBodyType =
  | "Star"
  | "Planet"
  | "DwarfPlanet"
  | "Moon"
  | "Asteroid"
  | "Comet"
  | "Custom";

// ---------------------------------------------------------------------------
// Horizons query block
// ---------------------------------------------------------------------------

/**
 * Parameters forwarded verbatim to the JPL Horizons API for this body.
 *
 * Kept separate from `naifId` because small-body identifiers follow a different
 * convention than major-body NAIF IDs:
 *  - Major bodies (planets, moons): numeric string e.g. `"399"`.
 *  - Asteroids / dwarf planets:     `"DES=<number>;"` prefix e.g. `"DES=1;"`.
 *  - Comets:                         `"DES=<designation>;"` e.g. `"DES=1P;"`.
 */
export interface HorizonsQueryParams {
  /**
   * Value passed verbatim to the Horizons `COMMAND` parameter.
   * @example "399"       // Earth (major body)
   * @example "DES=1;"    // Ceres (small body by designation)
   * @example "DES=1P;"   // 1P/Halley (comet)
   */
  command: string;
  /**
   * Horizons `CENTER` parameter — defines the reference frame origin.
   * @example "500@10"   // heliocentric (Sun body-center)
   * @example "500@399"  // geocentric (Earth body-center)
   */
  center: string;
}

// ---------------------------------------------------------------------------
// Physics block
// ---------------------------------------------------------------------------

/**
 * Physical constants stored in conventional SI/IAU units.
 * The fetcher converts these to AU³/day² before writing `planets.json`,
 * so the RK4 engine never needs to know the original units.
 */
export interface TargetPhysics {
  /** Body mass in kilograms. */
  massKg: number;
  /** Mean equatorial radius in kilometers. */
  radiusKm: number;
  /**
   * Standard gravitational parameter GM in km³/s².
   * Set to `0` for negligible-mass bodies (comets, spacecraft).
   */
  gmKm3s2: number;
}

// ---------------------------------------------------------------------------
// Render block
// ---------------------------------------------------------------------------

/** Visual properties consumed by the Canvas 2D renderer. */
export interface TargetRender {
  /** CSS hex color string (e.g. `"#4fa3e0"`). */
  color: string;
  /**
   * Optional fixed display radius in pixels.
   * When omitted, the renderer computes the radius from body mass
   * using `getBodyRadius()` in `body-renderer.ts`.
   */
  radiusPx?: number;
}

// ---------------------------------------------------------------------------
// Target entry — one entry per body
// ---------------------------------------------------------------------------

/**
 * Complete descriptor for a single fetchable body.
 * One entry exists in `target-mapping.json` per known body.
 */
export interface TargetEntry {
  /**
   * Stable internal key used as the map key in the fetcher and as the
   * lookup key in `planets.json`. Must be lowercase ASCII, no spaces.
   * @example "earth", "ceres", "halley"
   */
  key: string;
  /**
   * Official SPICE/NAIF numeric identifier — the canonical source-of-truth
   * for this body inside the app. Not necessarily equal to `horizons.command`.
   * @example "399"        // Earth
   * @example "2000001"    // Ceres
   * @example "136199"     // Eris
   */
  naifId: string;
  /**
   * Human-readable name shown in the UI.
   * Also used as `body.name` in `BodyState` / `RenderBody`.
   */
  displayName: string;
  /** Physical classification of the body. */
  bodyType: TargetBodyType;
  /** Horizons API query parameters specific to this body. */
  horizons: HorizonsQueryParams;
  /** Physical constants in SI/IAU units. */
  physics: TargetPhysics;
  /** Canvas renderer properties. */
  render: TargetRender;
}

// ---------------------------------------------------------------------------
// Root document
// ---------------------------------------------------------------------------

/** Root structure of `target-mapping.json`. */
export interface TargetMapping {
  /** Semantic version of the mapping file (e.g. `"1.0.0"`). */
  version: string;
  /** All bodies known to OrbitalJS in fetch-priority order. */
  targets: TargetEntry[];
}
