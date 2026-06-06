import { type Component, createSignal, Show } from 'solid-js';
import {
  GRAVITATION_EXPLANATION,
  NEWTON_EXPLANATION,
  EDO_EXPLANATION,
  RK4_EXPLANATION,
  ENERGY_CONSERVATION_EXPLANATION,
} from '@/constants/math-explanations';

const HowItWorks: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <div class="mt-4 rounded-lg border border-slate-700 bg-slate-900/50">
      <button
        onClick={() => setIsOpen(!isOpen())}
        class="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-semibold tracking-wider text-slate-300 transition-colors hover:text-white"
      >
        <span>COMO FUNCIONA</span>
        <span>{isOpen() ? '▲' : '▼'}</span>
      </button>

      <Show when={isOpen()}>
        <div class="max-h-96 space-y-3 overflow-auto border-t border-slate-700 p-3">
          <div>
            <div class="text-[11px] font-bold text-yellow-400">Ley de Gravitacion Universal</div>
            <div class="mt-1 font-mono text-[10px] text-slate-400">F = G · m₁ · m₂ / r²</div>
            <div class="mt-0.5 text-[10px] text-slate-500">{GRAVITATION_EXPLANATION}</div>
          </div>

          <div>
            <div class="text-[11px] font-bold text-yellow-400">Segunda Ley de Newton</div>
            <div class="mt-1 font-mono text-[10px] text-slate-400">a = F / m → d²r/dt² = a</div>
            <div class="mt-0.5 text-[10px] text-slate-500">{NEWTON_EXPLANATION}</div>
          </div>

          <div>
            <div class="text-[11px] font-bold text-yellow-400">Sistema de EDOs de primer orden</div>
            <div class="mt-1 font-mono text-[10px] text-slate-400">dr/dt = v, dv/dt = a(r)</div>
            <div class="mt-0.5 text-[10px] text-slate-500">{EDO_EXPLANATION}</div>
          </div>

          <div>
            <div class="text-[11px] font-bold text-yellow-400">Runge-Kutta 4 (RK4)</div>
            <div class="mt-1 font-mono text-[10px] text-slate-400">
              <div>k₁ = f(t, y)</div>
              <div>k₂ = f(t + Δt/2, y + k₁·Δt/2)</div>
              <div>k₃ = f(t + Δt/2, y + k₂·Δt/2)</div>
              <div>k₄ = f(t + Δt, y + k₃·Δt)</div>
              <div>y(t+Δt) = y + (k₁ + 2k₂ + 2k₃ + k₄)·Δt/6</div>
            </div>
            <div class="mt-0.5 text-[10px] text-slate-500">{RK4_EXPLANATION}</div>
          </div>

          <div>
            <div class="text-[11px] font-bold text-yellow-400">Conservacion de la Energia</div>
            <div class="mt-1 font-mono text-[10px] text-slate-400">
              E = K + U = ½·m·v² - G·M·m/r = constante
            </div>
            <div class="mt-0.5 text-[10px] text-slate-500">{ENERGY_CONSERVATION_EXPLANATION}</div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default HowItWorks;
