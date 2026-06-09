import { type Component, createEffect, createMemo, createSignal, For, Show } from 'solid-js';
import {
  bodies,
  setBodies,
  showHohmann,
  setShowHohmann,
  hohmannParams,
  setHohmannParams,
} from '../stores/simulation-store';
import { UNIVERSAL_CONSTS } from '@/shared/constants';
import { clearSpaceshipTrail } from '@/presentation/renderers/draw-spaceship';
import type { RenderBody } from '@/shared/types';
import { SPACESHIP_NAME, SPACESHIP_MASS, BODY_COLLISION_RADII_AU } from '@/shared/types/spaceship';

const { G } = UNIVERSAL_CONSTS;
const KM_S_PER_AU_DAY = 1731.48;

export const HohmannPanel: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false);

  const availablePlanets = createMemo(
    () => {
      return bodies().filter((b) => b.name !== 'Sun' && b.name !== SPACESHIP_NAME);
    },
    [],
    {
      equals: (a, b) => {
        if (a.length !== b.length) return false;
        return a.every((body, i) => body.name === b[i]?.name);
      },
    }
  );

  // Automatically validate and sync hohmannParams when available planets change
  createEffect(() => {
    const list = availablePlanets();
    if (list.length < 2) return;

    const current = hohmannParams();
    let newOrigin = current.origin;
    let newTarget = current.target;

    const hasOrigin = list.some((p) => p.name === newOrigin);
    const hasTarget = list.some((p) => p.name === newTarget);

    if (!hasOrigin || !hasTarget || newOrigin === newTarget) {
      // Find Earth and Mars if they exist, otherwise the first two planets
      const earthExists = list.some((p) => p.name === 'Earth');
      const marsExists = list.some((p) => p.name === 'Mars');

      if (earthExists && marsExists) {
        newOrigin = 'Earth';
        newTarget = 'Mars';
      } else {
        newOrigin = list[0]!.name;
        newTarget = list[1]!.name;
      }
      setHohmannParams({ origin: newOrigin, target: newTarget });
    }
  });

  // Avoid origin and target being the same planet by automatically switching the other planet
  const handleOriginChange = (name: string) => {
    setHohmannParams((p) => {
      if (p.target === name) {
        const other = availablePlanets().find((pl) => pl.name !== name);
        return { origin: name, target: other ? other.name : name };
      }
      return { ...p, origin: name };
    });
  };

  const handleTargetChange = (name: string) => {
    setHohmannParams((p) => {
      if (p.origin === name) {
        const other = availablePlanets().find((pl) => pl.name !== name);
        return { origin: other ? other.name : name, target: name };
      }
      return { ...p, target: name };
    });
  };

  const calculation = createMemo(() => {
    const list = bodies();
    const params = hohmannParams();

    const originBody = list.find((b) => b.name === params.origin);
    const targetBody = list.find((b) => b.name === params.target);

    if (!originBody || !targetBody || originBody.name === targetBody.name) {
      return null;
    }

    // Distance to Sun (assuming Sun is near 0,0)
    const r1 = Math.sqrt(originBody.x * originBody.x + originBody.y * originBody.y);
    const r2 = Math.sqrt(targetBody.x * targetBody.x + targetBody.y * targetBody.y);

    if (r1 === 0 || r2 === 0) return null;

    // Speeds of planets
    const v1 = Math.sqrt(G / r1);
    const v2 = Math.sqrt(G / r2);

    const a = (r1 + r2) / 2;

    // Delta-v burns
    const dv1 = v1 * (Math.sqrt((2 * r2) / (r1 + r2)) - 1);
    const dv2 = v2 * (1 - Math.sqrt((2 * r1) / (r1 + r2)));
    const totalDv = Math.abs(dv1) + Math.abs(dv2);

    // Time of flight in days
    const timeOfFlightDays = Math.PI * Math.sqrt((a * a * a) / G);

    return {
      r1,
      r2,
      dv1,
      dv2,
      totalDv,
      timeOfFlightDays,
      originBody,
    };
  });

  const handleLaunchHohmann = () => {
    const calc = calculation();
    if (!calc) return;

    const origin = calc.originBody;
    const dv1 = calc.dv1;

    // Magnitud de la velocidad del planeta
    const v = Math.sqrt(origin.vx * origin.vx + origin.vy * origin.vy);
    if (v === 0) return;

    // Vector unitario tangencial (en la dirección de la velocidad)
    const tx = origin.vx / v;
    const ty = origin.vy / v;

    // Velocidad de la nave: velocidad del planeta + impulso de Hohmann
    const vxShip = origin.vx + dv1 * tx;
    const vyShip = origin.vy + dv1 * ty;

    // --- CORRECCIÓN DE SINGULARIDAD GRAVITACIONAL ---
    // Sacamos la nave del centro exacto del planeta usando el radio de colisión
    const bodyRadius = BODY_COLLISION_RADII_AU[origin.name] ?? 0.02;
    const offsetDistance = bodyRadius * 3; // Distancia segura fuera de la gravedad extrema del planeta

    // Si aceleramos (dv1 > 0), nos ponemos por delante. Si frenamos (dv1 < 0), nos ponemos por detrás.
    const sign = dv1 >= 0 ? 1 : -1;
    const offsetX = tx * offsetDistance * sign;
    const offsetY = ty * offsetDistance * sign;

    const spaceship: RenderBody = {
      name: SPACESHIP_NAME,
      mass: SPACESHIP_MASS,
      x: origin.x + offsetX,
      y: origin.y + offsetY,
      vx: vxShip,
      vy: vyShip,
      radius: 4,
      color: '#00ffff',
      launchedFrom: origin.name,
      // Propiedades de Hohmann para aplicar el segundo impulso en el loop de física
      hohmannDv2Applied: false,
      hohmannTargetR: calc.r2,
      hohmannDv2Val: calc.dv2,
      hohmannDirection: calc.r2 > calc.r1 ? 'out' : 'in',
    };

    // Reemplazar nave existente si la hay
    clearSpaceshipTrail();
    setBodies([...bodies().filter((b) => b.name !== SPACESHIP_NAME), spaceship]);
  };

  return (
    <div class="mt-2 rounded-lg border border-slate-700 bg-slate-900/50">
      <button
        onClick={() => setIsOpen(!isOpen())}
        class="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-semibold tracking-wider text-slate-300 transition-colors hover:text-white"
      >
        <span>TRANSFERENCIA DE HOHMANN</span>
        <span>{isOpen() ? '▲' : '▼'}</span>
      </button>

      <Show when={isOpen()}>
        <div class="flex flex-col gap-3 border-t border-slate-700 p-3 text-xs text-slate-300">
          <div class="flex gap-2">
            <div class="flex-1">
              <label class="mb-1 block text-[10px] text-slate-400 uppercase">Origen</label>
              <select
                value={hohmannParams().origin}
                onChange={(e) => handleOriginChange(e.currentTarget.value)}
                class="select select-bordered select-xs w-full border-slate-700 bg-slate-800 text-slate-300"
              >
                <For each={availablePlanets()}>
                  {(p) => (
                    <option value={p.name} selected={p.name === hohmannParams().origin}>
                      {p.name}
                    </option>
                  )}
                </For>
              </select>
            </div>

            <div class="flex-1">
              <label class="mb-1 block text-[10px] text-slate-400 uppercase">Destino</label>
              <select
                value={hohmannParams().target}
                onChange={(e) => handleTargetChange(e.currentTarget.value)}
                class="select select-bordered select-xs w-full border-slate-700 bg-slate-800 text-slate-300"
              >
                <For each={availablePlanets()}>
                  {(p) => (
                    <option value={p.name} selected={p.name === hohmannParams().target}>
                      {p.name}
                    </option>
                  )}
                </For>
              </select>
            </div>
          </div>

          <Show
            when={calculation()}
            fallback={
              <div class="py-1 text-center text-slate-500">Selecciona planetas distintos</div>
            }
          >
            {(calc) => (
              <div class="flex flex-col gap-2 rounded bg-slate-950/60 p-2">
                <div class="flex justify-between">
                  <span class="text-slate-500">Distancia r₁:</span>
                  <span class="font-mono">{calc().r1.toFixed(3)} UA</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Distancia r₂:</span>
                  <span class="font-mono">{calc().r2.toFixed(3)} UA</span>
                </div>
                <div class="my-1 border-t border-slate-800"></div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Impulso Δv₁:</span>
                  <span class="font-mono text-green-400">
                    {(calc().dv1 * KM_S_PER_AU_DAY).toFixed(2)} km/s
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Impulso Δv₂:</span>
                  <span class="font-mono text-green-400">
                    {(calc().dv2 * KM_S_PER_AU_DAY).toFixed(2)} km/s
                  </span>
                </div>
                <div class="flex justify-between font-bold">
                  <span class="text-slate-400">Total ΔV:</span>
                  <span class="font-mono text-yellow-400">
                    {(calc().totalDv * KM_S_PER_AU_DAY).toFixed(2)} km/s
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Tiempo de viaje:</span>
                  <span class="font-mono text-blue-400">
                    {calc().timeOfFlightDays.toFixed(1)} días
                  </span>
                </div>

                <div class="mt-2 flex flex-col gap-1.5">
                  <label class="flex cursor-pointer items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      checked={showHohmann()}
                      onChange={(e) => setShowHohmann(e.currentTarget.checked)}
                      class="checkbox checkbox-xs checkbox-primary"
                    />
                    <span class="text-[11px] text-slate-300">Mostrar elipse de transferencia</span>
                  </label>

                  <button
                    onClick={handleLaunchHohmann}
                    class="btn btn-xs btn-primary w-full text-[10px]"
                  >
                    🚀 Lanzar Nave Hohmann
                  </button>
                </div>
              </div>
            )}
          </Show>
        </div>
      </Show>
    </div>
  );
};

export default HohmannPanel;
