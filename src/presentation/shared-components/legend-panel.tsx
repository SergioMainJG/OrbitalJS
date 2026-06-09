import { type Component, For, Show } from 'solid-js';
import {
  planetBodies,
  spaceshipBodies,
  showHohmann,
  showLagrange,
} from '@/features/simulation/stores/simulation-store';
import { isComparing } from '@/features/comparison/stores/comparison-store';
import { getBodyColor } from '@/presentation/renderers/body-renderer';
import { COLORS } from '@/shared/constants';

const PLANET_TRANSLATIONS: Record<string, string> = {
  Sun: 'Sol',
  Mercury: 'Mercurio',
  Venus: 'Venus',
  Earth: 'Tierra',
  Mars: 'Marte',
  Jupiter: 'Júpiter',
  Saturn: 'Saturno',
  Uranus: 'Urano',
  Neptune: 'Neptuno',
  Pluto: 'Plutón',
  Moon: 'Luna',
  Nemesis: 'Némesis',
  'Star A': 'Estrella A',
  'Star B': 'Estrella B',
};

const LegendPanel: Component = () => {
  return (
    <div class="flex shrink-0 flex-col gap-3 rounded-xl border border-slate-800 bg-[#13132a] p-3 shadow-md">
      <span class="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
        Leyenda
      </span>

      {/* Sección 1: Cuerpos Celestes */}
      <div class="flex flex-col gap-1.5">
        <span class="text-[9px] font-semibold tracking-wider text-slate-500 uppercase">
          Cuerpos Celestes
        </span>
        <div class="flex flex-col gap-1 pl-1">
          <For each={planetBodies()}>
            {(body) => (
              <div class="flex items-center gap-2">
                <div
                  class="h-2.5 w-2.5 rounded-full shadow-[0_0_6px_var(--tw-shadow-color)]"
                  style={{
                    'background-color': getBodyColor(body.name),
                    '--tw-shadow-color': getBodyColor(body.name),
                  }}
                />
                <span class="font-mono text-[11px] text-slate-300">
                  {PLANET_TRANSLATIONS[body.name] ?? body.name}
                </span>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Sección 2: Naves Espaciales (Dinámica) */}
      <Show when={spaceshipBodies().length > 0}>
        <div class="flex flex-col gap-1.5 border-t border-slate-800/60 pt-2">
          <span class="text-[9px] font-semibold tracking-wider text-slate-500 uppercase">
            Vehículos
          </span>
          <div class="flex flex-col gap-1 pl-1">
            <div class="flex items-center gap-2">
              <svg
                class="h-3 w-3 fill-current text-cyan-400 drop-shadow-[0_0_3px_rgba(34,211,238,0.6)] filter"
                viewBox="0 0 10 10"
              >
                <polygon points="10,5 2,9 4,5 2,1" />
              </svg>
              <span class="font-mono text-[11px] text-slate-300">Nave Espacial</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-[1.5px] w-5 bg-gradient-to-r from-cyan-500/20 to-cyan-400" />
              <span class="font-mono text-[11px] text-slate-300">Estela de Nave</span>
            </div>
          </div>
        </div>
      </Show>

      {/* Sección 3: Referencias y Maniobras */}
      <div class="flex flex-col gap-1.5 border-t border-slate-800/60 pt-2">
        <span class="text-[9px] font-semibold tracking-wider text-slate-500 uppercase">
          Referencias
        </span>
        <div class="flex flex-col gap-1 pl-1">
          <div class="flex items-center gap-2">
            <div class="h-2.5 w-2.5 rounded-full border border-[#4ade80] bg-[#4ade80]/20 shadow-[0_0_4px_rgba(74,222,128,0.4)]" />
            <span class="font-mono text-[11px] text-slate-300">Posición Inicial (t = 0)</span>
          </div>

          <div class="flex items-center gap-2">
            <div class="h-[1.5px] w-5 bg-slate-500/50" />
            <span class="font-mono text-[11px] text-slate-300">Órbita Planetaria</span>
          </div>

          <Show when={showHohmann()}>
            <div class="flex items-center gap-2">
              <div class="w-5 border-t border-dashed border-[#a855f7]" />
              <span class="font-mono text-[11px] text-purple-300">Órbita Hohmann</span>
            </div>
          </Show>

          <Show when={showLagrange()}>
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full bg-[#10b981] shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
              <span class="font-mono text-[11px] text-emerald-300">Puntos Lagrange (L₁-L₅)</span>
            </div>
          </Show>
        </div>
      </div>

      {/* Sección 4: Comparación de Integradores (Dinámica) */}
      <Show when={isComparing()}>
        <div class="flex flex-col gap-1.5 border-t border-slate-800/60 pt-2">
          <span class="text-[9px] font-semibold tracking-wider text-slate-500 uppercase">
            Comparación
          </span>
          <div class="flex flex-col gap-1 pl-1">
            <div class="flex items-center gap-2">
              <div class="h-[1.5px] w-5" style={{ 'background-color': COLORS.rk4 }} />
              <span class="font-mono text-[11px] text-slate-300">Trayectoria RK4</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-5 border-t border-dashed" style={{ 'border-color': COLORS.euler }} />
              <span class="font-mono text-[11px] text-slate-300">Trayectoria Euler</span>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default LegendPanel;
