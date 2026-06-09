import { type Component, createSignal, Show } from 'solid-js';
import {
  isRunning,
  setIsRunning,
  simSpeed,
  setSimSpeed,
  setBodies,
  setCurrentDay,
  integrator,
  setIntegrator,
  dt,
  showOrbit,
  setShowOrbit,
  showTrajectory,
  setShowTrajectory,
  followSpaceship,
  setFollowSpaceship,
  showLagrange,
  setShowLagrange,
  addLogMessage,
} from '@/features/simulation/stores/simulation-store';
import { simulationRuntime } from '@/core/engines/simulation-runtime';
import type { IntegratorName } from '@/core/engines/physics-engine';
import { loadScenario } from '@/application/use-cases/load-scenario.use-case';
import {
  SOLAR_SYSTEM_SCENARIO,
  EARTH_MOON_SCENARIO,
  BINARY_STAR_SCENARIO,
  PERTURBATION_SCENARIO,
} from '@/shared/scenarios';
import { SolarSystemCatalog } from '@/application/catalogs/solar-system-catalog';
import { resetComparison } from '@/features/comparison/stores/comparison-store';
import { SPACESHIP_NAME } from '@/shared/types/spaceship';
import type { SpaceshipLauncher } from '@/presentation/renderers/spaceship-launcher';

const SPEEDS = [0.1, 0.5, 1, 2, 5, 10];
const catalog = new SolarSystemCatalog();

const SimulationControls: Component = () => {
  const [selectedScenario, setSelectedScenario] = createSignal('solar-system-full');
  const [selectedEpoch, setSelectedEpoch] = createSignal('2000-Jan-01');
  const [isLoading, setIsLoading] = createSignal(false);

  const handleReset = () => {
    setIsRunning(false);

    const id = selectedScenario();
    if (id === 'solar-system-full') {
      loadScenario(SOLAR_SYSTEM_SCENARIO);
    } else if (id === 'earth-moon-placeholder') {
      loadScenario(EARTH_MOON_SCENARIO);
    } else if (id === 'binary-star-placeholder') {
      loadScenario(BINARY_STAR_SCENARIO);
    } else if (id === 'nemesis-perturbation') {
      loadScenario(PERTURBATION_SCENARIO);
    }

    const canvas = document.querySelector('canvas') as
      | (HTMLCanvasElement & {
          launcherInstance?: SpaceshipLauncher;
        })
      | null;
    if (canvas?.launcherInstance) {
      canvas.launcherInstance.reset();
    }

    setBodies((prev) => prev.filter((b) => !b.name.startsWith(SPACESHIP_NAME)));
    resetComparison();

    setTimeout(() => setIsRunning(true), 50);
  };

  const handleScenarioChange = (id: string) => {
    setSelectedScenario(id);
    setIsRunning(false);
    setBodies((prev) => prev.filter((b) => !b.name.startsWith(SPACESHIP_NAME)));
    resetComparison();

    if (id === 'solar-system-full') {
      loadScenario(SOLAR_SYSTEM_SCENARIO);
      setSelectedEpoch('2000-Jan-01');
    } else if (id === 'earth-moon-placeholder') {
      loadScenario(EARTH_MOON_SCENARIO);
    } else if (id === 'binary-star-placeholder') {
      loadScenario(BINARY_STAR_SCENARIO);
    } else if (id === 'nemesis-perturbation') {
      loadScenario(PERTURBATION_SCENARIO);
    }

    setTimeout(() => setIsRunning(true), 50);
  };

  const handleEpochChange = async (epoch: string) => {
    setSelectedEpoch(epoch);
    setIsRunning(false);
    setIsLoading(true);
    setBodies((prev) => prev.filter((b) => !b.name.startsWith(SPACESHIP_NAME)));
    resetComparison();

    try {
      const scenario = await catalog.getScenarioFromHorizons(epoch);
      loadScenario(scenario);
      addLogMessage(
        `[INFO] Época cargada: ${scenario.name} (${scenario.bodies.length - 1} planetas obtenidos desde la NASA).`
      );
    } catch (err) {
      console.error(err);
      addLogMessage(
        `[WARNING] Falló la descarga de NASA JPL para época ${epoch}. Cargando datos de fallback local.`
      );
      alert('Error al obtener datos reales de JPL Horizons. Usando fallback offline.');
      loadScenario(SOLAR_SYSTEM_SCENARIO);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsRunning(true), 50);
    }
  };

  const handleStep = () => {
    setIsRunning(false);
    simulationRuntime.setIntegrator(integrator() as IntegratorName);
    const simDt = dt() * simSpeed();
    setBodies((prev) => {
      const next = simulationRuntime.tick(prev, simDt);
      return next.map((b, i) => ({
        ...prev[i]!,
        ...b,
      }));
    });
    setCurrentDay((d) => d + simDt);
  };

  return (
    <div class="flex flex-col gap-4 p-2">
      {/* Escenario selector */}
      <div class="flex flex-col gap-1">
        <span class="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Escenario
        </span>
        <select
          value={selectedScenario()}
          onChange={(e) => handleScenarioChange(e.currentTarget.value)}
          class="select select-bordered select-xs w-full border-slate-700 bg-slate-800 text-slate-300"
        >
          <option value="solar-system-full">Sistema Solar Real (J2000)</option>
          <option value="earth-moon-placeholder">Sistema Tierra - Luna</option>
          <option value="binary-star-placeholder">Sistema Estrella Binaria</option>
          <option value="nemesis-perturbation">Perturbación Némesis (3 Cuerpos)</option>
        </select>
      </div>

      {/* Epoca JPL Horizons (Visible only for solar system scenario) */}
      <Show when={selectedScenario() === 'solar-system-full'}>
        <div class="flex flex-col gap-1">
          <span class="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            Época Histórica (NASA JPL)
          </span>
          <select
            value={selectedEpoch()}
            onChange={(e) => handleEpochChange(e.currentTarget.value)}
            disabled={isLoading()}
            class="select select-bordered select-xs w-full border-slate-700 bg-slate-800 text-slate-300 disabled:bg-slate-900 disabled:text-slate-500"
          >
            <option value="2000-Jan-01">J2000 (01 Ene 2000) [Defecto]</option>
            <option value="1957-Oct-04">Sputnik 1 (04 Oct 1957)</option>
            <option value="1969-Jul-20">Apolo 11 (20 Jul 1969)</option>
            <option value="1977-Aug-20">Voyager 1 (20 Ago 1977)</option>
            <option value="2011-Nov-26">Curiosity Mars (26 Nov 2011)</option>
          </select>
        </div>
      </Show>

      {/* Loading state indicator */}
      <Show when={isLoading()}>
        <div class="flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-xs text-yellow-400">
          <span class="loading loading-spinner loading-xs"></span>
          Conectando con JPL Horizons...
        </div>
      </Show>

      <div class="flex gap-2">
        <button
          onClick={() => {
            setIsRunning(!isRunning());
          }}
          disabled={isLoading()}
          class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {isRunning() ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              Pausa
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Play
            </>
          )}
        </button>

        <button
          onClick={handleStep}
          disabled={isLoading()}
          class="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
          title="Avanzar 1 paso"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 15,12 5,21" />
            <rect x="17" y="3" width="3" height="18" />
          </svg>
        </button>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Velocidad: {simSpeed()}x
        </span>
        <input
          type="range"
          min="0"
          max="5"
          step="1"
          value={SPEEDS.indexOf(simSpeed())}
          onInput={(e) => setSimSpeed(SPEEDS[Number(e.currentTarget.value)] ?? 1)}
          disabled={isLoading()}
          aria-label="Velocidad de simulación"
          aria-valuetext={`${simSpeed()}x velocidad`}
          class="w-full accent-yellow-400 disabled:opacity-50"
        />
        <div class="flex justify-between text-[9px] text-slate-500">
          <span>0.1x</span>
          <span>0.5x</span>
          <span>1x</span>
          <span>2x</span>
          <span>5x</span>
          <span>10x</span>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Integrador
        </span>
        <div class="flex gap-1">
          {(['Euler', 'RK4'] as const).map((name) => (
            <button
              onClick={() => {
                setIntegrator(name);
                addLogMessage(`[INFO] Integrador cambiado a: ${name}`);
              }}
              disabled={isLoading()}
              aria-pressed={integrator() === name}
              class={`flex-1 rounded px-2 py-1 text-xs disabled:opacity-50 ${
                integrator() === name
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Visualización settings block */}
      <div class="flex flex-col gap-1 border-t border-slate-800 pt-3">
        <span class="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Visualización
        </span>
        <div class="mt-1.5 flex flex-col gap-2">
          <label class="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={showOrbit()}
              onChange={(e) => setShowOrbit(e.currentTarget.checked)}
              class="checkbox checkbox-xs checkbox-primary bg-slate-850"
            />
            <span class="text-[11px] text-slate-300">Mostrar Órbitas planetarias</span>
          </label>

          <label class="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={showTrajectory()}
              onChange={(e) => setShowTrajectory(e.currentTarget.checked)}
              class="checkbox checkbox-xs checkbox-primary bg-slate-850"
            />
            <span class="text-[11px] text-slate-300">Mostrar Trayectoria nave</span>
          </label>

          <Show when={selectedScenario() === 'solar-system-full'}>
            <label class="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={showLagrange()}
                onChange={(e) => setShowLagrange(e.currentTarget.checked)}
                class="checkbox checkbox-xs checkbox-primary bg-slate-850"
              />
              <span class="text-[11px] text-slate-300">Puntos Lagrange Sol-Tierra</span>
            </label>
          </Show>

          <label class="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={followSpaceship()}
              onChange={(e) => setFollowSpaceship(e.currentTarget.checked)}
              class="checkbox checkbox-xs checkbox-primary bg-slate-850"
            />
            <span class="text-[11px] text-slate-300">Seguir nave con cámara</span>
          </label>
        </div>
      </div>

      <button
        onClick={handleReset}
        disabled={isLoading()}
        class="flex items-center justify-center gap-2 rounded-lg border border-red-800 bg-red-950 px-3 py-2 text-sm text-red-400 hover:bg-red-900 disabled:opacity-50"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Reset
      </button>
    </div>
  );
};

export default SimulationControls;
