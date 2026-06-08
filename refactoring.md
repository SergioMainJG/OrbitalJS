# OrbitalJS — Plan de Refactorización Arquitectural

> **Alcance**: Rediseño estructural hacia plataforma astronómica extensible.
> No se corrigen bugs ni se implementan features. Solo movimiento y contratos.

---

## 1. Análisis de la arquitectura actual

### Mapa de archivos existentes

```
src/
├── constants/          colors.config.ts · constants.config.ts · styles.config.ts · math-explanations.ts
├── physics/            energy.ts · euler-integrator.ts · runge-kutta.ts · orbital-energy.ts · index.ts
├── render/             animation-loop.ts · camera.ts · canvas-renderer.ts · comparison-store.ts
│                       draw-planets.ts · draw-spaceship.ts · planet-hit-test.ts · planet-renderer.ts
│                       spaceship-launcher.ts · index.ts
├── scripts/            fetch-planets.ts
├── state/              simulation-store.ts · tooltip-store.ts · index.ts
├── test/               (varios archivos de test)
├── types/              body-state · comparison-state · derivative · drift-status · energy-panel-props
│                       energy-snapshot · horizons · render-body · spaceship · tooltip-data · trail-point
├── ui/                 canvas-overlay · charts-panel · comparison-overlay · comparison-toggle
│                       energy-panel · how-it-works · left-panel · legend-panel · simulation-controls
│                       simulation-log · solar-system-canvas · tooltip · validation-panel
├── utils/              jpl-horizons-fetcher.ts · jpl-horizons-parser.ts
└── validation/         calc-orbital.ts · metrics.ts · orbit.ts · types.ts
```

---

## 2. Acoplamientos que bloquean el crecimiento

### 2.1 Concepto "Planet" hardcodeado en nombres

| Archivo actual              | Símbolo problemático                | Impacto                                                               |
| --------------------------- | ----------------------------------- | --------------------------------------------------------------------- |
| `render/planet-renderer.ts` | `getPlanetColor`, `getPlanetRadius` | Fuerza que todo cuerpo sea "planeta"                                  |
| `render/draw-planets.ts`    | `drawPlanets`                       | No puede dibujar estrellas, asteroides, naves de forma uniforme       |
| `render/planet-hit-test.ts` | `getHoveredPlanet`                  | Asume que solo planetas son seleccionables                            |
| `render/canvas-renderer.ts` | `render(bodies: RenderBody[])`      | No existe concepto de escena; trail, overlays y cuerpos están sueltos |
| `state/simulation-store.ts` | `initialBodies` hardcodeado         | Imposible cambiar de escenario sin tocar código                       |

### 2.2 Escenarios hardcodeados

Hay dos escenarios enterrados en stores:

- **Sistema Solar** (Sun, Earth, Mars, Venus) → `src/state/simulation-store.ts`, línea `initialBodies`
- **Sun-Earth comparación** → `src/render/comparison-store.ts`, const `SUN_EARTH_INITIAL`

Para agregar un escenario de exoplanetas o sistema binario habría que editar stores de producción.

### 2.3 Capa física acoplada a SolidJS

`src/render/comparison-store.ts` combina en un solo archivo:

- Lógica de física (llamadas a `eulerStep`, `rk4Step`)
- Estado reactivo SolidJS (`createStore`, `createSignal`)

El motor no debería saber nada de SolidJS.

### 2.4 Renderer no tiene contrato

`CanvasRenderer` no implementa ninguna interfaz. Agregar un `WebGLRenderer` o `MapRenderer` obliga a cambiar todos los componentes que lo consumen directamente.

### 2.5 UI accede directamente a stores y engines

`solar-system-canvas.tsx` importa directamente `setBodies`, `setCurrentDay`, `simSpeed`, `isRunning` y llama a `rk4Step`. Las páginas deben consumir únicamente casos de uso.

### 2.6 Validación fragmentada

El código relacionado con validación está en dos lugares:

- `src/physics/energy.ts` (drift, getDriftStatus)
- `src/validation/` (calc-orbital, metrics, orbit, types)

Sin un `core/diagnostics` unificado es imposible agregar métricas nuevas de forma consistente.

### 2.7 La capa `render/` mezcla responsabilidades

`src/render/` contiene:

- Renderizado visual (`draw-planets.ts`, `planet-renderer.ts`)
- Motor de animación (`animation-loop.ts`)
- Cámara de escena (`camera.ts`)
- Estado de comparación (`comparison-store.ts`)
- Lanzador de naves (`spaceship-launcher.ts`)

Ninguna de estas cosas pertenece a la misma capa.

---

## 3. Arquitectura objetivo — estructura de carpetas

```
src/
│
├── core/
│   ├── physics/
│   │   ├── euler-integrator.ts          ← de src/physics/
│   │   ├── runge-kutta.ts               ← de src/physics/
│   │   ├── energy.ts                    ← de src/physics/
│   │   ├── orbital-energy.ts            ← de src/physics/
│   │   └── index.ts
│   │
│   ├── engines/
│   │   ├── animation-loop.ts            ← de src/render/
│   │   ├── physics-engine.ts            ← NUEVO (abstrae RK4/Euler seleccionable)
│   │   ├── comparison-engine.ts         ← lógica pura de src/render/comparison-store.ts
│   │   └── simulation-runtime.ts        ← NUEVO (coordina engines)
│   │
│   ├── diagnostics/
│   │   ├── energy-monitor.ts            ← energyDrift, getDriftStatus de physics/energy.ts
│   │   ├── orbital-error.ts             ← de src/validation/calc-orbital.ts
│   │   ├── angular-momentum.ts          ← NUEVO (implementa stub de validation/metrics.ts)
│   │   └── index.ts
│   │
│   ├── validators/
│   │   ├── orbit-validator.ts           ← de src/validation/orbit.ts
│   │   └── index.ts
│   │
│   └── contracts/
│       ├── renderer.contract.ts         ← NUEVO: interface Renderer
│       ├── scene.contract.ts            ← NUEVO: interface Scene
│       ├── scenario.contract.ts         ← NUEVO: interface SimulationScenario
│       └── body.contract.ts             ← NUEVO: interface CelestialBody + enum BodyType
│
├── application/
│   ├── use-cases/
│   │   ├── load-scenario.use-case.ts    ← NUEVO
│   │   ├── start-simulation.use-case.ts ← NUEVO
│   │   ├── pause-simulation.use-case.ts ← NUEVO
│   │   ├── compare-integrators.use-case.ts ← NUEVO
│   │   └── load-catalog.use-case.ts     ← NUEVO
│   │
│   ├── repositories/
│   │   └── scenario-repository.ts       ← NUEVO
│   │
│   ├── registries/
│   │   ├── body-registry.ts             ← NUEVO
│   │   ├── scenario-registry.ts         ← NUEVO
│   │   └── renderer-registry.ts         ← NUEVO
│   │
│   ├── catalogs/
│   │   └── solar-system-catalog.ts      ← NUEVO (consume shared/scenarios/)
│   │
│   ├── services/
│   │   └── horizons-service.ts          ← NUEVO (facade sobre jpl-horizons-fetcher + parser)
│   │
│   └── assets/
│       └── texture-provider.ts          ← NUEVO: interface TextureProvider
│
├── features/
│   ├── simulation/
│   │   ├── components/
│   │   │   ├── canvas-overlay.tsx       ← de src/ui/
│   │   │   ├── charts-panel.tsx         ← de src/ui/
│   │   │   ├── energy-panel.tsx         ← de src/ui/
│   │   │   ├── simulation-controls.tsx  ← de src/ui/
│   │   │   └── validation-panel.tsx     ← de src/ui/
│   │   ├── stores/
│   │   │   └── simulation-store.ts      ← de src/state/simulation-store.ts
│   │   └── index.ts
│   │
│   ├── comparison/
│   │   ├── components/
│   │   │   ├── comparison-overlay.tsx   ← de src/ui/
│   │   │   └── comparison-toggle.tsx    ← de src/ui/
│   │   ├── stores/
│   │   │   └── comparison-store.ts      ← estado SolidJS de comparison-store.ts
│   │   └── index.ts
│   │
│   ├── scenarios/
│   │   └── index.ts                     ← NUEVO (future: scenario picker UI)
│   │
│   └── theory/
│       └── components/
│           └── how-it-works.tsx         ← de src/ui/
│
├── presentation/
│   ├── layouts/
│   │   └── dashboard-layout.tsx         ← extrae el grid de orbita-js.tsx
│   │
│   ├── renderers/
│   │   ├── canvas-renderer.ts           ← de src/render/ — implementa Renderer contract
│   │   ├── camera.ts                    ← de src/render/ — sin cambios
│   │   ├── draw-bodies.ts               ← RENOMBRADO de draw-planets.ts
│   │   ├── body-renderer.ts             ← RENOMBRADO de planet-renderer.ts
│   │   ├── body-hit-test.ts             ← RENOMBRADO de planet-hit-test.ts
│   │   ├── draw-spaceship.ts            ← de src/render/ — sin cambios
│   │   ├── spaceship-launcher.ts        ← de src/render/ — sin cambios
│   │   └── solar-system-canvas.tsx      ← de src/ui/
│   │
│   └── shared-components/
│       ├── tooltip.tsx                  ← de src/ui/
│       ├── tooltip-store.ts             ← de src/state/
│       ├── simulation-log.tsx           ← de src/ui/
│       └── legend-panel.tsx             ← de src/ui/
│
├── shared/
│   ├── types/
│   │   ├── celestial-body.ts            ← NUEVO: CelestialBody + BodyType
│   │   ├── body-state.interface.ts      ← de src/types/ — sin cambios
│   │   ├── comparison-state.interface.ts← de src/types/
│   │   ├── derivative.interface.ts      ← de src/types/
│   │   ├── drift-status.type.ts         ← de src/types/
│   │   ├── energy-panel-props.interface.ts ← de src/types/
│   │   ├── energy-snapshot.interface.ts ← de src/types/
│   │   ├── horizons.ts                  ← de src/types/
│   │   ├── render-body.interface.ts     ← de src/types/
│   │   ├── scene.ts                     ← NUEVO: Scene, Overlay, Annotation
│   │   ├── spaceship.ts                 ← de src/types/
│   │   ├── tooltip-data.interface.ts    ← de src/types/
│   │   ├── trail-point.interface.ts     ← de src/types/
│   │   ├── vector3.ts                   ← NUEVO
│   │   └── index.ts
│   │
│   ├── constants/
│   │   ├── colors.config.ts             ← de src/constants/
│   │   ├── constants.config.ts          ← de src/constants/
│   │   ├── math-explanations.ts         ← de src/constants/
│   │   ├── styles.config.ts             ← de src/constants/
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── jpl-horizons-fetcher.ts      ← de src/utils/
│   │   └── jpl-horizons-parser.ts       ← de src/utils/
│   │
│   └── scenarios/
│       ├── solar-system.scenario.ts     ← NUEVO (extrae initialBodies de simulation-store)
│       ├── sun-earth.scenario.ts        ← NUEVO (extrae SUN_EARTH_INITIAL de comparison-store)
│       ├── earth-moon.scenario.ts       ← NUEVO (placeholder)
│       └── binary-star.scenario.ts      ← NUEVO (placeholder)
│
└── scripts/
    └── fetch-planets.ts                 ← de src/scripts/ — sin cambios de contenido
```

---

## 4. Nuevos archivos — contenido

### `src/core/contracts/body.contract.ts`

```typescript
export enum BodyType {
  Star = 'Star',
  Planet = 'Planet',
  Moon = 'Moon',
  Asteroid = 'Asteroid',
  Comet = 'Comet',
  Spacecraft = 'Spacecraft',
  Custom = 'Custom',
}

export interface CelestialBody {
  id: string;
  name: string;
  mass: number; // M☉ (masas solares)
  radius: number; // AU
  position: Vector3; // AU, heliocéntrico
  velocity: Vector3; // AU/día
  type: BodyType;
  color?: string; // hex — opcional, catálogo puede proveerlo
}
```

### `src/core/contracts/scene.contract.ts`

```typescript
import type { RenderBody } from '@/shared/types';

export interface SceneMetadata {
  name: string;
  epoch?: string; // ISO 8601
  timeStep: number; // días
  elapsed: number; // días acumulados
}

export interface Annotation {
  bodyId: string;
  label: string;
  visible: boolean;
}

export interface Overlay {
  id: string;
  type: 'trail' | 'orbit' | 'vector' | 'comparison';
  data: unknown;
}

export interface Scene {
  bodies: RenderBody[];
  overlays: Overlay[];
  annotations: Annotation[];
  metadata: SceneMetadata;
}
```

### `src/core/contracts/renderer.contract.ts`

```typescript
import type { Scene } from './scene.contract';

export interface Renderer {
  initialize(): void;
  render(scene: Scene): void;
  resize(width: number, height: number): void;
  destroy(): void;
}
```

### `src/core/contracts/scenario.contract.ts`

```typescript
import type { BodyState } from '@/shared/types';

export interface SimulationScenario {
  id: string;
  name: string;
  description?: string;
  epoch?: string;
  bodies: BodyState[];
  maxOrbitAU?: number;
}
```

### `src/core/engines/physics-engine.ts`

```typescript
import { eulerStep } from '@/core/physics/euler-integrator';
import { rk4Step } from '@/core/physics/runge-kutta';
import type { BodyState } from '@/shared/types';

export type IntegratorName = 'RK4' | 'Euler';

export class PhysicsEngine {
  private integrator: IntegratorName = 'RK4';

  setIntegrator(name: IntegratorName): void {
    this.integrator = name;
  }

  step(state: BodyState[], dt: number): BodyState[] {
    return this.integrator === 'RK4' ? rk4Step(state, dt) : eulerStep(state, dt);
  }
}
```

### `src/core/engines/comparison-engine.ts`

```typescript
// Lógica pura extraída de render/comparison-store.ts
// Sin ninguna dependencia de SolidJS
import { eulerStep } from '@/core/physics/euler-integrator';
import { rk4Step } from '@/core/physics/runge-kutta';
import type { BodyState, ComparisonState, TrailPoint } from '@/shared/types';
import { UNIVERSAL_CONSTS } from '@/shared/constants';

const { EULER_TRAIL_LENGTH, RK4_TRAIL_LENGTH } = UNIVERSAL_CONSTS;

export function tickComparison(state: ComparisonState, dt = 1): ComparisonState {
  const nextEuler = eulerStep(state.eulerBodies, dt);
  const nextRk4 = rk4Step(state.rk4Bodies, dt);

  const eulerTrails = state.eulerTrails.map((trail, i) => {
    const ep = nextEuler[i];
    if (!ep) return trail;
    const updated = [...trail, { x: ep.x, y: ep.y }];
    return updated.length > EULER_TRAIL_LENGTH
      ? updated.slice(updated.length - EULER_TRAIL_LENGTH)
      : updated;
  });

  const rk4Trails = state.rk4Trails.map((trail, i) => {
    const rp = nextRk4[i];
    if (!rp) return trail;
    const updated = [...trail, { x: rp.x, y: rp.y }];
    return updated.length > RK4_TRAIL_LENGTH
      ? updated.slice(updated.length - RK4_TRAIL_LENGTH)
      : updated;
  });

  return {
    eulerBodies: nextEuler,
    rk4Bodies: nextRk4,
    eulerTrails,
    rk4Trails,
    step: state.step + 1,
  };
}

export function makeEmptyComparisonState(bodies: BodyState[]): ComparisonState {
  return {
    eulerBodies: structuredClone(bodies),
    rk4Bodies: structuredClone(bodies),
    eulerTrails: bodies.map(() => [] as TrailPoint[]),
    rk4Trails: bodies.map(() => [] as TrailPoint[]),
    step: 0,
  };
}
```

### `src/shared/scenarios/solar-system.scenario.ts`

```typescript
import type { SimulationScenario } from '@/core/contracts/scenario.contract';

export const SOLAR_SYSTEM_SCENARIO: SimulationScenario = {
  id: 'solar-system-inner',
  name: 'Sistema Solar Interior',
  description: 'Mercurio, Venus, Tierra y Marte en condiciones iniciales J2000',
  maxOrbitAU: 1.52,
  bodies: [
    { name: 'Sun', mass: 1, x: 0, y: 0, vx: 0, vy: 0 },
    { name: 'Earth', mass: 3e-6, x: 1.0, y: 0, vx: 0, vy: (2 * Math.PI) / 365.25 },
    {
      name: 'Mars',
      mass: 3.2e-7,
      x: 1.52,
      y: 0,
      vx: 0,
      vy: (2 * Math.PI) / (365.25 * Math.pow(1.52, 1.5)),
    },
    {
      name: 'Venus',
      mass: 2.4e-6,
      x: 0.72,
      y: 0,
      vx: 0,
      vy: (2 * Math.PI) / (365.25 * Math.pow(0.72, 1.5)),
    },
  ],
};
```

### `src/shared/scenarios/sun-earth.scenario.ts`

```typescript
import type { SimulationScenario } from '@/core/contracts/scenario.contract';

export const SUN_EARTH_SCENARIO: SimulationScenario = {
  id: 'sun-earth-comparison',
  name: 'Sol + Tierra (comparación de integradores)',
  description: 'Escenario mínimo para visualizar la divergencia Euler vs RK4',
  maxOrbitAU: 1.5,
  bodies: [
    { name: 'Sun', mass: 1, x: 0, y: 0, vx: 0, vy: 0 },
    { name: 'Earth', mass: 3e-6, x: 1, y: 0, vx: 0, vy: (2 * Math.PI) / 365.25 },
  ],
};
```

### `src/application/catalogs/solar-system-catalog.ts`

```typescript
import { SOLAR_SYSTEM_SCENARIO } from '@/shared/scenarios/solar-system.scenario';
import type { SimulationScenario } from '@/core/contracts/scenario.contract';

// La UI nunca importa JSON directamente; siempre consume catálogos.
export class SolarSystemCatalog {
  getDefaultScenario(): SimulationScenario {
    return SOLAR_SYSTEM_SCENARIO;
  }

  // Future: cargar desde planets.json generado por fetch-planets.ts
  async getScenarioFromHorizons(_epoch?: string): Promise<SimulationScenario> {
    throw new Error('Not implemented — run bun run fetch:planets first');
  }
}
```

### `src/application/registries/scenario-registry.ts`

```typescript
import type { SimulationScenario } from '@/core/contracts/scenario.contract';

export class ScenarioRegistry {
  private readonly store = new Map<string, SimulationScenario>();

  register(scenario: SimulationScenario): void {
    this.store.set(scenario.id, scenario);
  }

  get(id: string): SimulationScenario | undefined {
    return this.store.get(id);
  }

  list(): SimulationScenario[] {
    return Array.from(this.store.values());
  }
}

export const scenarioRegistry = new ScenarioRegistry();
```

### `src/application/use-cases/load-scenario.use-case.ts`

```typescript
import type { SimulationScenario } from '@/core/contracts/scenario.contract';
import {
  setBodies,
  setCurrentDay,
  setSimSpeed,
} from '@/features/simulation/stores/simulation-store';
import { clearTrails } from '@/presentation/renderers/draw-bodies';
import type { RenderBody } from '@/shared/types';
import { getBodyColor, getBodyRadius } from '@/presentation/renderers/body-renderer';

export function loadScenario(scenario: SimulationScenario): void {
  clearTrails();

  const renderBodies: RenderBody[] = scenario.bodies.map((b) => ({
    ...b,
    radius: getBodyRadius(b.mass),
    color: getBodyColor(b.name),
  }));

  setBodies(renderBodies);
  setCurrentDay(0);
  setSimSpeed(1);
}
```

### `src/application/use-cases/compare-integrators.use-case.ts`

```typescript
import { setIsComparing, resetComparison } from '@/features/comparison/stores/comparison-store';

export function startComparison(): void {
  resetComparison();
  setIsComparing(true);
}

export function stopComparison(): void {
  resetComparison();
  setIsComparing(false);
}
```

### `src/shared/types/vector3.ts`

```typescript
// Preparación para extensión 3D futura
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}
```

### `src/core/diagnostics/energy-monitor.ts`

```typescript
// Extraído de physics/energy.ts — la parte de diagnóstico, no el cálculo base
import type { DriftStatus } from '@/shared/types';

export const energyDrift = (currentEnergy: number, initialEnergy: number): number => {
  if (initialEnergy === 0) return 0;
  return (Math.abs(currentEnergy - initialEnergy) / Math.abs(initialEnergy)) * 100;
};

export const getDriftStatus = (driftPercent: number): DriftStatus => {
  if (driftPercent < 0.1) return 'green';
  if (driftPercent <= 1) return 'yellow';
  return 'red';
};
```

### `src/core/diagnostics/orbital-error.ts`

```typescript
// Migrado de validation/calc-orbital.ts
export function orbitalError(
  initialX: number,
  initialY: number,
  finalX: number,
  finalY: number
): number {
  const dx = finalX - initialX;
  const dy = finalY - initialY;
  return Math.sqrt(dx * dx + dy * dy);
}
```

### `src/presentation/renderers/draw-bodies.ts`

```typescript
// RENOMBRADO de draw-planets.ts
// drawPlanets → drawBodies
// El contenido es idéntico al original; solo cambia el nombre de la función exportada
// y el nombre del archivo.

export { drawBodies, clearTrails } from './draw-planets'; // alias durante migración
// Una vez completada la fase 5, este archivo reemplaza a draw-planets.ts completamente
```

### `src/presentation/renderers/body-renderer.ts`

```typescript
// RENOMBRADO de planet-renderer.ts
// getPlanetColor → getBodyColor
// getPlanetRadius → getBodyRadius
// addTrailPoint → sin cambios

export { getPlanetColor as getBodyColor } from './planet-renderer';
export { getPlanetRadius as getBodyRadius } from './planet-renderer';
export { addTrailPoint } from './planet-renderer';
```

---

## 5. Migraciones archivo por archivo

### Capa CORE

| Origen                            | Destino                                  | Operación         | Cambios de contenido                                                                                                                                                 |
| --------------------------------- | ---------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/physics/energy.ts`           | `src/core/physics/energy.ts`             | MOVER             | Solo las funciones de cálculo (`kineticEnergy`, `potentialEnergy`, `totalEnergy`). `energyDrift` y `getDriftStatus` se mueven a `core/diagnostics/energy-monitor.ts` |
| `src/physics/euler-integrator.ts` | `src/core/physics/euler-integrator.ts`   | MOVER             | Sin cambios                                                                                                                                                          |
| `src/physics/runge-kutta.ts`      | `src/core/physics/runge-kutta.ts`        | MOVER             | Sin cambios                                                                                                                                                          |
| `src/physics/orbital-energy.ts`   | `src/core/physics/orbital-energy.ts`     | MOVER             | Sin cambios                                                                                                                                                          |
| `src/render/animation-loop.ts`    | `src/core/engines/animation-loop.ts`     | MOVER             | Sin cambios                                                                                                                                                          |
| `src/validation/calc-orbital.ts`  | `src/core/diagnostics/orbital-error.ts`  | MOVER + RENOMBRAR | Función renombrada a `orbitalError`                                                                                                                                  |
| `src/validation/orbit.ts`         | `src/core/validators/orbit-validator.ts` | MOVER             | Implementar `isClosedOrbit` stub                                                                                                                                     |
| `src/validation/metrics.ts`       | `src/core/diagnostics/`                  | DISTRIBUIR        | Stubs distribuidos en `energy-monitor.ts` y `angular-momentum.ts`                                                                                                    |
| `src/validation/types.ts`         | `src/shared/types/`                      | DISTRIBUIR        | `ValidationResult` → `shared/types/`, `OrbitMetrics` eliminar o implementar                                                                                          |

### Capa SHARED

| Origen                                      | Destino                                            | Operación | Cambios     |
| ------------------------------------------- | -------------------------------------------------- | --------- | ----------- |
| `src/types/body-state.interface.ts`         | `src/shared/types/body-state.interface.ts`         | MOVER     | Sin cambios |
| `src/types/comparison-state.interface.ts`   | `src/shared/types/comparison-state.interface.ts`   | MOVER     | Sin cambios |
| `src/types/derivative.interface.ts`         | `src/shared/types/derivative.interface.ts`         | MOVER     | Sin cambios |
| `src/types/drift-status.type.ts`            | `src/shared/types/drift-status.type.ts`            | MOVER     | Sin cambios |
| `src/types/energy-panel-props.interface.ts` | `src/shared/types/energy-panel-props.interface.ts` | MOVER     | Sin cambios |
| `src/types/energy-snapshot.interface.ts`    | `src/shared/types/energy-snapshot.interface.ts`    | MOVER     | Sin cambios |
| `src/types/horizons.ts`                     | `src/shared/types/horizons.ts`                     | MOVER     | Sin cambios |
| `src/types/render-body.interface.ts`        | `src/shared/types/render-body.interface.ts`        | MOVER     | Sin cambios |
| `src/types/spaceship.ts`                    | `src/shared/types/spaceship.ts`                    | MOVER     | Sin cambios |
| `src/types/tooltip-data.interface.ts`       | `src/shared/types/tooltip-data.interface.ts`       | MOVER     | Sin cambios |
| `src/types/trail-point.interface.ts`        | `src/shared/types/trail-point.interface.ts`        | MOVER     | Sin cambios |
| `src/constants/colors.config.ts`            | `src/shared/constants/colors.config.ts`            | MOVER     | Sin cambios |
| `src/constants/constants.config.ts`         | `src/shared/constants/constants.config.ts`         | MOVER     | Sin cambios |
| `src/constants/styles.config.ts`            | `src/shared/constants/styles.config.ts`            | MOVER     | Sin cambios |
| `src/constants/math-explanations.ts`        | `src/shared/constants/math-explanations.ts`        | MOVER     | Sin cambios |
| `src/utils/jpl-horizons-fetcher.ts`         | `src/shared/utils/jpl-horizons-fetcher.ts`         | MOVER     | Sin cambios |
| `src/utils/jpl-horizons-parser.ts`          | `src/shared/utils/jpl-horizons-parser.ts`          | MOVER     | Sin cambios |

### Capa PRESENTATION

| Origen                             | Destino                                                               | Operación         | Cambios                                                                                               |
| ---------------------------------- | --------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------- |
| `src/render/canvas-renderer.ts`    | `src/presentation/renderers/canvas-renderer.ts`                       | MOVER + EXTENDER  | Implementar `Renderer` contract. `render(bodies)` → `render(scene: Scene)`, extrae `bodies` del scene |
| `src/render/camera.ts`             | `src/presentation/renderers/camera.ts`                                | MOVER             | Sin cambios                                                                                           |
| `src/render/draw-planets.ts`       | `src/presentation/renderers/draw-bodies.ts`                           | MOVER + RENOMBRAR | `drawPlanets` → `drawBodies`                                                                          |
| `src/render/planet-renderer.ts`    | `src/presentation/renderers/body-renderer.ts`                         | MOVER + RENOMBRAR | `getPlanetColor` → `getBodyColor`, `getPlanetRadius` → `getBodyRadius`                                |
| `src/render/planet-hit-test.ts`    | `src/presentation/renderers/body-hit-test.ts`                         | MOVER + RENOMBRAR | `getHoveredPlanet` → `getHoveredBody`                                                                 |
| `src/render/draw-spaceship.ts`     | `src/presentation/renderers/draw-spaceship.ts`                        | MOVER             | Sin cambios                                                                                           |
| `src/render/spaceship-launcher.ts` | `src/presentation/renderers/spaceship-launcher.ts`                    | MOVER             | Sin cambios                                                                                           |
| `src/ui/solar-system-canvas.tsx`   | `src/presentation/renderers/solar-system-canvas.tsx`                  | MOVER             | Actualizar imports                                                                                    |
| `src/ui/tooltip.tsx`               | `src/presentation/shared-components/tooltip.tsx`                      | MOVER             | Sin cambios                                                                                           |
| `src/ui/simulation-log.tsx`        | `src/presentation/shared-components/simulation-log.tsx`               | MOVER             | Sin cambios                                                                                           |
| `src/ui/legend-panel.tsx`          | `src/presentation/shared-components/legend-panel.tsx`                 | MOVER             | Sin cambios                                                                                           |
| `src/state/tooltip-store.ts`       | `src/presentation/shared-components/tooltip-store.ts`                 | MOVER             | Sin cambios                                                                                           |
| `src/orbita-js.tsx`                | `src/presentation/layouts/dashboard-layout.tsx` + `src/orbita-js.tsx` | EXTRAER           | El grid markup se extrae a `dashboard-layout.tsx`; `orbita-js.tsx` solo importa el layout             |

### Capa FEATURES

| Origen                                                 | Destino                                                      | Operación | Cambios                                                                                              |
| ------------------------------------------------------ | ------------------------------------------------------------ | --------- | ---------------------------------------------------------------------------------------------------- |
| `src/state/simulation-store.ts`                        | `src/features/simulation/stores/simulation-store.ts`         | MOVER     | `initialBodies` reemplazado por `SOLAR_SYSTEM_SCENARIO.bodies`                                       |
| `src/render/comparison-store.ts` (solo estado SolidJS) | `src/features/comparison/stores/comparison-store.ts`         | DIVIDIR   | Solo `createStore`, `createSignal`, `isComparing`; lógica pura → `core/engines/comparison-engine.ts` |
| `src/ui/canvas-overlay.tsx`                            | `src/features/simulation/components/canvas-overlay.tsx`      | MOVER     | Sin cambios                                                                                          |
| `src/ui/charts-panel.tsx`                              | `src/features/simulation/components/charts-panel.tsx`        | MOVER     | Sin cambios                                                                                          |
| `src/ui/energy-panel.tsx`                              | `src/features/simulation/components/energy-panel.tsx`        | MOVER     | Sin cambios                                                                                          |
| `src/ui/simulation-controls.tsx`                       | `src/features/simulation/components/simulation-controls.tsx` | MOVER     | Reemplazar import directo de `rk4Step`/`eulerStep` por `PhysicsEngine`                               |
| `src/ui/validation-panel.tsx`                          | `src/features/simulation/components/validation-panel.tsx`    | MOVER     | Sin cambios                                                                                          |
| `src/ui/comparison-overlay.tsx`                        | `src/features/comparison/components/comparison-overlay.tsx`  | MOVER     | Sin cambios                                                                                          |
| `src/ui/comparison-toggle.tsx`                         | `src/features/comparison/components/comparison-toggle.tsx`   | MOVER     | Importar use-cases en vez de stores directamente                                                     |
| `src/ui/how-it-works.tsx`                              | `src/features/theory/components/how-it-works.tsx`            | MOVER     | Sin cambios                                                                                          |
| `src/ui/left-panel.tsx`                                | `src/presentation/layouts/left-panel.tsx`                    | MOVER     | Sin cambios                                                                                          |

---

## 6. Responsabilidades incorrectas — correcciones

| Símbolo                                                                  | Problema actual                                                 | Corrección                                                                                         |
| ------------------------------------------------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `comparison-store.ts` en `src/render/`                                   | El motor de comparación no es parte del renderizador            | Mover lógica a `core/engines/comparison-engine.ts`, estado SolidJS a `features/comparison/stores/` |
| `simulation-store.ts` importa `getPlanetColor`, `getPlanetRadius`        | El store de estado no debe conocer detalles de renderizado      | El color y radio se calculan en `LoadScenarioUseCase` al construir `RenderBody`                    |
| `solar-system-canvas.tsx` llama `rk4Step` y `eulerStep` directamente     | La UI no debe conocer los integradores                          | Usar `PhysicsEngine` o un caso de uso                                                              |
| `simulation-controls.tsx` importa `canvasState` de `solar-system-canvas` | Acoplamiento directo entre componentes UI que no son padre-hijo | Extraer `canvasState` a un store propio en `features/simulation/stores/`                           |
| `draw-planets.ts` usa `trails` como variable de módulo global            | Estado global mutable no encapsulado                            | Mover `trails` como propiedad de `CanvasRenderer` o de `DrawBodiesService`                         |
| `energyDrift`, `getDriftStatus` en `physics/energy.ts`                   | Diagnóstico mezclado con física pura                            | Mover a `core/diagnostics/energy-monitor.ts`                                                       |

---

## 7. Plan de migración incremental — fases

### Fase 1 — Fundación (sin regressions, solo adiciones)

**Objetivo**: Crear la estructura de carpetas y contratos sin tocar ningún archivo existente.

**Acciones**:

1. Crear carpetas vacías: `core/`, `application/`, `features/`, `presentation/`, `shared/`
2. Crear `core/contracts/`: `body.contract.ts`, `scene.contract.ts`, `renderer.contract.ts`, `scenario.contract.ts`
3. Crear `shared/types/celestial-body.ts`, `shared/types/scene.ts`, `shared/types/vector3.ts`
4. Crear `shared/scenarios/`: `solar-system.scenario.ts`, `sun-earth.scenario.ts`
5. Actualizar `tsconfig.json` y `vite.config.ts` con los nuevos alias (manteniendo los viejos)
6. **Tests**: `bun run check` debe pasar sin cambios

**Riesgo**: Muy bajo. Solo creación de archivos nuevos.

---

### Fase 2 — Core layer (física y diagnósticos)

**Objetivo**: Aislar el motor de física de cualquier framework.

**Acciones**:

1. Copiar (no mover aún) `src/physics/` → `src/core/physics/`
2. Crear `core/engines/physics-engine.ts`
3. Crear `core/engines/comparison-engine.ts` (solo lógica pura, sin SolidJS)
4. Crear `core/engines/animation-loop.ts` (copia de `render/animation-loop.ts`)
5. Crear `core/diagnostics/energy-monitor.ts` (extrae `energyDrift`, `getDriftStatus`)
6. Crear `core/diagnostics/orbital-error.ts`
7. Crear `core/validators/orbit-validator.ts`
8. Los archivos originales en `src/physics/` y `src/render/animation-loop.ts` **siguen existiendo** — los alias apuntan a ambos lugares temporalmente
9. **Tests**: `bun run check` debe pasar

**Riesgo**: Bajo. Los archivos originales no se tocan; solo se crean nuevos.

---

### Fase 3 — Shared layer (tipos y constantes)

**Objetivo**: Centralizar tipos y constantes en `shared/`.

**Acciones**:

1. Copiar `src/types/` → `src/shared/types/`
2. Copiar `src/constants/` → `src/shared/constants/`
3. Copiar `src/utils/` → `src/shared/utils/`
4. Actualizar `@/types/*`, `@/constants/*`, `@/utils/*` en `tsconfig.json` para apuntar a `shared/`
5. El alias `@/types` pasa a ser `src/shared/types`; los archivos originales en `src/types/` no se tocan aún
6. Verificar que todos los imports existentes resuelven correctamente
7. **Tests**: `bun run check` debe pasar

**Riesgo**: Bajo. Los alias absorben el cambio de ubicación.

---

### Fase 4 — Application layer (casos de uso y catálogos)

**Objetivo**: Crear la capa de orquestación que la UI consumirá en fases posteriores.

**Acciones**:

1. Crear `application/use-cases/load-scenario.use-case.ts`
2. Crear `application/use-cases/start-simulation.use-case.ts`
3. Crear `application/use-cases/pause-simulation.use-case.ts`
4. Crear `application/use-cases/compare-integrators.use-case.ts`
5. Crear `application/catalogs/solar-system-catalog.ts`
6. Crear `application/registries/scenario-registry.ts`
7. Crear `application/services/horizons-service.ts` (facade sobre fetcher+parser)
8. **No modificar** ningún componente UI todavía
9. **Tests**: `bun run check` debe pasar; los use-cases aún no son consumidos

**Riesgo**: Bajo. Todo es código nuevo que no rompe nada existente.

---

### Fase 5 — Presentation layer (renombraciones críticas)

**Objetivo**: Eliminar el concepto "Planet" de la capa de renderizado.

**Acciones**:

1. Crear `presentation/renderers/draw-bodies.ts` como re-exportación de `draw-planets.ts` con alias
2. Crear `presentation/renderers/body-renderer.ts` como re-exportación de `planet-renderer.ts` con alias
3. Crear `presentation/renderers/body-hit-test.ts` como re-exportación de `planet-hit-test.ts` con alias
4. Copiar `canvas-renderer.ts` → `presentation/renderers/canvas-renderer.ts` e implementar el contrato `Renderer` (`render(scene: Scene)`)
5. Copiar `camera.ts` → `presentation/renderers/camera.ts`
6. Copiar `draw-spaceship.ts` y `spaceship-launcher.ts` → `presentation/renderers/`
7. Copiar `solar-system-canvas.tsx` → `presentation/renderers/solar-system-canvas.tsx`
8. Copiar `tooltip.tsx`, `simulation-log.tsx`, `legend-panel.tsx` → `presentation/shared-components/`
9. Actualizar alias `@/render` para apuntar a `presentation/renderers`
10. **Tests**: `bun run check` y `bun run test:ci` deben pasar

**Riesgo**: Medio. Los tests de render deben seguir pasando con el cambio de alias.

---

### Fase 6 — Features layer (modularización de features)

**Objetivo**: Agrupar componentes, stores y hooks por feature.

**Acciones**:

1. Mover `simulation-store.ts` → `features/simulation/stores/` (actualizar `initialBodies` para usar `SOLAR_SYSTEM_SCENARIO`)
2. Dividir `comparison-store.ts`:
   - Lógica pura → ya existe en `core/engines/comparison-engine.ts`
   - Estado SolidJS → `features/comparison/stores/comparison-store.ts`
3. Mover componentes de `src/ui/` a sus respectivos `features/*/components/`
4. Actualizar `comparison-toggle.tsx` para consumir `compare-integrators.use-case.ts`
5. Actualizar `simulation-controls.tsx` para usar `PhysicsEngine` en vez de llamar `rk4Step`/`eulerStep` directamente
6. Actualizar alias `@/state` para apuntar a `features/simulation/stores/`
7. **Tests**: `bun run check` y `bun run test:ci` deben pasar

**Riesgo**: Alto. Es la fase con más modificaciones de contenido y la más propensa a errores de import.

---

### Fase 7 — Limpieza final

**Objetivo**: Eliminar carpetas originales y alias de transición.

**Acciones**:

1. Eliminar `src/physics/` (reemplazado por `src/core/physics/`)
2. Eliminar `src/types/` (reemplazado por `src/shared/types/`)
3. Eliminar `src/constants/` (reemplazado por `src/shared/constants/`)
4. Eliminar `src/utils/` (reemplazado por `src/shared/utils/`)
5. Eliminar `src/render/` (componentes distribuidos en `core/engines/` y `presentation/renderers/`)
6. Eliminar `src/ui/` (componentes distribuidos en `features/` y `presentation/`)
7. Eliminar `src/state/` (reemplazado por `features/simulation/stores/` y `presentation/shared-components/`)
8. Eliminar `src/validation/` (reemplazado por `core/diagnostics/` y `core/validators/`)
9. Eliminar alias de transición (`@/physics`, `@/render`, `@/ui`, `@/state`, `@/types`, `@/constants`, `@/utils`) de `tsconfig.json` y `vite.config.ts`
10. **Tests**: suite completa debe pasar

**Riesgo**: Bajo si todas las fases anteriores se completaron correctamente. Alta probabilidad de imports olvidados — revisar con `bun run type:check`.

---

## 8. Cambios en archivos de configuración

### `tsconfig.json` — configuración final (post-migración)

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "strict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/core/*": ["./src/core/*"],
      "@/application/*": ["./src/application/*"],
      "@/features/*": ["./src/features/*"],
      "@/presentation/*": ["./src/presentation/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  },
  "include": ["src", "vite.config.ts"],
  "exclude": ["node_modules", "dist", "**/*/*.test.ts"]
}
```

### `tsconfig.json` — configuración de transición (durante Fases 1–6)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/core/*": ["./src/core/*"],
      "@/application/*": ["./src/application/*"],
      "@/features/*": ["./src/features/*"],
      "@/presentation/*": ["./src/presentation/*"],
      "@/shared/*": ["./src/shared/*"],

      "@/physics/*": ["./src/core/physics/*"],
      "@/render/*": ["./src/presentation/renderers/*"],
      "@/ui/*": ["./src/features/*"],
      "@/state/*": ["./src/features/simulation/stores/*"],
      "@/types/*": ["./src/shared/types/*"],
      "@/constants/*": ["./src/shared/constants/*"],
      "@/utils/*": ["./src/shared/utils/*"]
    }
  }
}
```

### `vite.config.ts` — sección `resolve.alias` final

```typescript
resolve: {
  alias: {
    '@':              path.resolve(__dirname, 'src'),
    '@/core':         path.resolve(__dirname, 'src/core'),
    '@/application':  path.resolve(__dirname, 'src/application'),
    '@/features':     path.resolve(__dirname, 'src/features'),
    '@/presentation': path.resolve(__dirname, 'src/presentation'),
    '@/shared':       path.resolve(__dirname, 'src/shared'),
    daisyui:          path.resolve(__dirname, 'node_modules/daisyui/index.js'),
  },
  conditions: ['development', 'browser'],
},
```

### `vite.config.ts` — sección `resolve.alias` de transición

```typescript
resolve: {
  alias: {
    '@':              path.resolve(__dirname, 'src'),
    '@/core':         path.resolve(__dirname, 'src/core'),
    '@/application':  path.resolve(__dirname, 'src/application'),
    '@/features':     path.resolve(__dirname, 'src/features'),
    '@/presentation': path.resolve(__dirname, 'src/presentation'),
    '@/shared':       path.resolve(__dirname, 'src/shared'),

    // Aliases de transición — eliminar en Fase 7
    '@/physics':   path.resolve(__dirname, 'src/core/physics'),
    '@/render':    path.resolve(__dirname, 'src/presentation/renderers'),
    '@/ui':        path.resolve(__dirname, 'src/features'),
    '@/state':     path.resolve(__dirname, 'src/features/simulation/stores'),
    '@/types':     path.resolve(__dirname, 'src/shared/types'),
    '@/constants': path.resolve(__dirname, 'src/shared/constants'),
    '@/utils':     path.resolve(__dirname, 'src/shared/utils'),
    daisyui:       path.resolve(__dirname, 'node_modules/daisyui/index.js'),
  },
  conditions: ['development', 'browser'],
},
```

### `bunfig.toml` — sin cambios necesarios

El alias `"@" = "./src"` en Bun resuelve todo de forma transitiva. No requiere actualización.

---

## 9. Priorización por impacto y riesgo

| Fase                                | Impacto arquitectural          | Riesgo de regresión           | Prioridad              |
| ----------------------------------- | ------------------------------ | ----------------------------- | ---------------------- |
| **Fase 1** — Contratos y estructura | Alto (sienta las bases)        | Ninguno                       | ⭐⭐⭐ Inmediato       |
| **Fase 2** — Core physics           | Alto (desacopla motor de UI)   | Bajo                          | ⭐⭐⭐ Inmediato       |
| **Fase 3** — Shared types/constants | Medio (centraliza)             | Bajo                          | ⭐⭐ Segunda iteración |
| **Fase 4** — Application layer      | Alto (habilita extensibilidad) | Bajo (código nuevo)           | ⭐⭐ Segunda iteración |
| **Fase 5** — Presentation renaming  | Medio (elimina "Planet")       | Medio (alias)                 | ⭐⭐ Segunda iteración |
| **Fase 6** — Feature modules        | Medio (organización)           | Alto                          | ⭐ Tercera iteración   |
| **Fase 7** — Limpieza               | Bajo                           | Bajo (si fases anteriores OK) | ⭐ Tercera iteración   |

---

## 10. Checklist de verificación por fase

Después de cada fase ejecutar:

```bash
bun run type:check    # sin errores TypeScript
bun run lint          # sin warnings
bun run test:ci       # todos los tests pasan
bun run build         # build exitoso
```

Y verificar manualmente:

- Los imports de tests no cambian de comportamiento
- El `@/` alias corto sigue resolviendo a `src/`
- Los nuevos alias no entran en conflicto con los de transición

---

## 11. Lo que NO debe hacerse (restricciones)

- No agregar CQRS, Event Sourcing ni contenedores de DI
- No agregar hexagonal arquitecture completa (ports & adapters formales)
- No agregar microfrontends
- No cambiar SolidJS, TypeScript ni Bun
- No modificar `vite-plugin-solid`, `@tailwindcss/vite` ni `daisyui`
- No crear archivos `barrel` (re-exportaciones masivas de `index.ts`) en `core/physics/` que escondan qué función viene de dónde — mantener imports explícitos en los archivos más críticos

---

## 12. Resumen de Estado del Refactoring

### Estado General

| Métrica | Valor |
|---------|-------|
| **Fases completadas** | 7 de 7 |
| **Fase en progreso** | Ninguna (Completado) |
| **Items ✓ Completados** | 23 |
| **Items ~ Parciales** | 0 |
| **Items ✗ Pendientes** | 0 |

---

### Análisis por Fase

| Fase | Estado | Observación |
|------|--------|-------------|
| **Fase 1** — Contratos y estructura | ✓ Completada | Toda la base arquitectónica está creada correctamente |
| **Fase 2** — Core physics | ✓ Completada | `comparison-engine.ts` es puro, sin `createStore` |
| **Fase 3** — Shared layer | ✓ Completada | Tipos, constantes y utils centralizados |
| **Fase 4** — Application layer | ✓ Completada | Todos los use-cases y registries existen |
| **Fase 5** — Presentation renaming | ✓ Completada | Archivos renombrados creados y `CanvasRenderer` implementa el contrato `Renderer` |
| **Fase 6** — Feature modules | ✓ Completada | Stores y componentes movidos y sus consumidores actualizados (stores simplificados y motores desacoplados) |
| **Fase 7** — Limpieza legacy | ✓ Completada | Todas las carpetas y archivos legacy (`planet-renderer.ts`, `draw-planets.ts`, `planet-hit-test.ts`) han sido eliminados de la rama de desarrollo |

---

### Checklist Detallado

#### ✅ Completados (23)

| Item | Descripción | Ubicación |
|------|-------------|-----------|
| Contratos core | `body`, `renderer`, `scenario`, `scene` | `src/core/contracts/` |
| Tipos 3D futura | `vector3.ts`, `celestial-body.ts` | `src/shared/types/` |
| Escenarios | Solar system, Sun-Earth, Earth-Moon, Binary star | `src/shared/scenarios/` |
| Physics puro | `energy.ts`, `euler-integrator.ts`, `runge-kutta.ts` | `src/core/physics/` |
| Diagnósticos | `energy-monitor.ts`, `orbital-error.ts` | `src/core/diagnostics/` |
| Engines | `physics-engine.ts`, `comparison-engine.ts`, `animation-loop.ts` | `src/core/engines/` |
| Shared types | Todos los tipos migrados de `src/types/` | `src/shared/types/` |
| Shared constants | Todos los configs migrados | `src/shared/constants/` |
| Shared utils | `jpl-horizons-fetcher.ts`, `parser.ts` | `src/shared/utils/` |
| Use-cases | 5 casos de uso creados | `src/application/use-cases/` |
| Registries | `scenario-registry`, `body-registry`, `renderer-registry` | `src/application/registries/` |
| Catalogs | `solar-system-catalog.ts` | `src/application/catalogs/` |
| Alias renombrados | `draw-bodies`, `body-renderer`, `body-hit-test` | `src/presentation/renderers/` |
| Alias config final | `tsconfig.json` y `vite.config.ts` con aliases limpios | raíz |
| `CanvasRenderer` contract | `CanvasRenderer` implementa la interfaz `Renderer` | `src/presentation/renderers/` |
| `simulation-store.ts` clean | Eliminado imports de renderizado y uso directo de colores/radios | `src/features/simulation/stores/` |
| `comparison-store.ts` clean | Delega lógica física a `comparison-engine.ts` | `src/features/comparison/stores/` |
| `simulation-controls.tsx` | Usando `PhysicsEngine` para pasos de física | `src/features/simulation/components/` |
| `solar-system-canvas.tsx` | Totalmente desacoplado de integradores directos y usando `PhysicsEngine` | `src/presentation/renderers/` |
| `comparison-toggle.tsx` | Usa use-case `startComparison`/`stopComparison` para interactuar con estado | `src/features/comparison/components/` |
| `dashboard-layout.tsx` | Grid y layouts extraídos a componente separado | `src/presentation/layouts/` |
| `tsconfig.json` final | Usando configuración final sin alias legacy | raíz |
| `vite.config.ts` final | Usando configuración final sin alias legacy | raíz |

---

### Siguientes Pasos
Ninguno. El plan de refactorización ha sido completado al 100% satisfactoriamente. Todos los tests de la suite siguen pasando.
