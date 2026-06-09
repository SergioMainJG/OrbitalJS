import { type Component, onMount, createSignal, Show } from 'solid-js';
import { DashboardLayout } from '@/presentation/layouts/dashboard-layout';
import { loadScenario } from '@/application/use-cases/load-scenario.use-case';
import { SOLAR_SYSTEM_SCENARIO } from '@/shared/scenarios';
import { DocumentationPage } from '@/presentation/layouts/documentation-page';

const OrbitalJS: Component = () => {
  const [activeTab, setActiveTab] = createSignal<'simulador' | 'documentacion'>('simulador');

  onMount(() => {
    loadScenario(SOLAR_SYSTEM_SCENARIO);
  });

  return (
    <div class="flex h-screen w-screen flex-col overflow-hidden bg-[#0a0a1a] font-sans text-slate-100">
      {/* Header / Navigation bar */}
      <header class="z-50 flex h-14 w-full shrink-0 items-center justify-between border-b border-slate-800 bg-[#0c0c1e]/80 px-4 backdrop-blur-md md:px-6">
        <div class="flex items-center gap-2.5">
          <div class="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <div class="h-2.5 w-2.5 rounded-full bg-cyan-300"></div>
            {/* Orbit ring */}
            <div class="absolute h-5 w-5 rotate-45 rounded-full border border-cyan-400/60"></div>
          </div>
          <span class="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-base font-bold tracking-wider text-transparent">
            OrbitalJS
          </span>
        </div>

        <nav class="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            class={`rounded-lg border px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
              activeTab() === 'simulador'
                ? 'bg-indigo-650/40 border-indigo-500/50 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.25)]'
                : 'border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            Simulador
          </button>
          <button
            onClick={() => setActiveTab('documentacion')}
            class={`rounded-lg border px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
              activeTab() === 'documentacion'
                ? 'bg-indigo-650/40 border-indigo-500/50 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.25)]'
                : 'border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            Documentación
          </button>
        </nav>
      </header>

      {/* Page Content area */}
      <main class="min-h-0 w-full flex-1 overflow-hidden">
        <Show when={activeTab() === 'simulador'} fallback={<DocumentationPage />}>
          <DashboardLayout />
        </Show>
      </main>
    </div>
  );
};

export { OrbitalJS };
