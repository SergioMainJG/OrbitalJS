import { type Component } from 'solid-js';
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
} from '@/features/simulation/stores/simulation-store';
import { PhysicsEngine, type IntegratorName } from '@/core/engines/physics-engine';
import { loadScenario } from '@/application/use-cases/load-scenario.use-case';
import { SOLAR_SYSTEM_SCENARIO } from '@/shared/scenarios';
import { resetComparison } from '@/features/comparison/stores/comparison-store';
import { SPACESHIP_NAME } from '@/shared/types/spaceship';
import type { SpaceshipLauncher } from '@/presentation/renderers/spaceship-launcher';

const SPEEDS = [0.1, 0.5, 1, 2, 5, 10];

const physicsEngine = new PhysicsEngine();

const SimulationControls: Component = () => {
  const handleReset = () => {
    setIsRunning(false);
    loadScenario(SOLAR_SYSTEM_SCENARIO);

    // BUG FIX: reset spaceship launcher state so a new ship can be launched.
    // We access the launcher via the canvas element where it was attached.
    const canvas = document.querySelector('canvas') as
      | (HTMLCanvasElement & {
          launcherInstance?: SpaceshipLauncher;
        })
      | null;
    if (canvas?.launcherInstance) {
      canvas.launcherInstance.reset();
    }

    // Remove any existing spaceship from bodies
    setBodies((prev) => prev.filter((b) => b.name !== SPACESHIP_NAME));

    // BUG FIX: also reset comparison state so energy monitor starts fresh
    resetComparison();

    setTimeout(() => setIsRunning(true), 50);
  };

  const handleStep = () => {
    setIsRunning(false);
    physicsEngine.setIntegrator(integrator() as IntegratorName);
    const simDt = dt() * simSpeed();
    setBodies((prev) => {
      const next = physicsEngine.step(prev, simDt);
      return next.map((b, i) => ({
        ...prev[i]!,
        ...b,
      }));
    });
    setCurrentDay((d) => d + simDt);
  };

  return (
    <div class="flex flex-col gap-4 p-2">
      {/* Play/Pause */}
      <div class="flex gap-2">
        <button
          onClick={() => {
            setIsRunning(!isRunning());
          }}
          class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white hover:bg-slate-700"
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

        {/* Step forward */}
        <button
          onClick={handleStep}
          class="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white hover:bg-slate-700"
          title="Avanzar 1 paso"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 15,12 5,21" />
            <rect x="17" y="3" width="3" height="18" />
          </svg>
        </button>
      </div>

      {/* Velocidad */}
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
          class="w-full accent-yellow-400"
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

      {/* Toggle Integrador Euler/RK4 */}
      <div class="flex flex-col gap-1">
        <span class="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Integrador
        </span>
        <div class="flex gap-1">
          {(['Euler', 'RK4'] as const).map((name) => (
            <button
              onClick={() => setIntegrator(name)}
              class={`flex-1 rounded px-2 py-1 text-xs ${
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

      {/* Reset */}
      <button
        onClick={handleReset}
        class="flex items-center justify-center gap-2 rounded-lg border border-red-800 bg-red-950 px-3 py-2 text-sm text-red-400 hover:bg-red-900"
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
