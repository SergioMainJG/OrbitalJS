import { type Component, lazy, onMount, onCleanup } from 'solid-js';
import { Route, useNavigate, useLocation } from '@solidjs/router';
import { loadScenario } from '@/application/use-cases/load-scenario.use-case';
import { stopSimulation } from '@/application/use-cases/stop-simulation.use-case';
import { SOLAR_SYSTEM_SCENARIO } from '@/shared/scenarios';
import DocumentationPage from '@/presentation/layouts/documentation-page';

const SimulatorPage = lazy(() => import('@/presentation/layouts/simulator-page'));

const AppHeader: Component = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSimulator = () => location.pathname === '/simulador';

  return (
    <header
      class="z-50 flex h-14 w-full shrink-0 items-center justify-between border-b border-slate-800 bg-[#0c0c1e]/80 px-4 backdrop-blur-md md:px-6"
      role="banner"
    >
      <div class="flex items-center gap-2.5">
        <div class="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
          <div class="h-2.5 w-2.5 rounded-full bg-cyan-300" />
          <div class="absolute h-5 w-5 rotate-45 rounded-full border border-cyan-400/60" />
        </div>
        <span class="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-base font-bold tracking-wider text-transparent">
          OrbitalJS
        </span>
      </div>

      <nav class="flex items-center gap-2" role="navigation" aria-label="Navegación principal">
        <button
          id="nav-docs"
          onClick={() => navigate('/')}
          aria-current={!isSimulator() ? 'page' : undefined}
          class={`rounded-lg border px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
            !isSimulator()
              ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.25)]'
              : 'border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
          }`}
        >
          Documentación
        </button>
        <button
          id="nav-simulator"
          onClick={() => navigate('/simulador')}
          aria-current={isSimulator() ? 'page' : undefined}
          class={`rounded-lg border px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
            isSimulator()
              ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.25)]'
              : 'border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
          }`}
        >
          Simulador
        </button>
      </nav>
    </header>
  );
};

const DocsRoute: Component = () => (
  <div class="page-docs flex min-h-screen w-full flex-col bg-[#0a0a1a] font-sans text-slate-100">
    <AppHeader />
    <main
      id="panel-docs"
      class="w-full flex-1 overflow-y-auto"
      role="main"
      aria-label="Documentación de OrbitalJS"
    >
      <DocumentationPage />
    </main>
  </div>
);

const SimulatorRoute: Component = () => {
  onMount(() => {
    loadScenario(SOLAR_SYSTEM_SCENARIO);
  });

  onCleanup(() => {
    stopSimulation();
  });

  return (
    <div class="page-simulator flex h-screen w-screen flex-col overflow-hidden bg-[#0a0a1a] font-sans text-slate-100">
      <AppHeader />
      <main
        id="panel-simulator"
        class="min-h-0 w-full flex-1 overflow-hidden"
        role="main"
        aria-label="Simulador orbital OrbitalJS"
      >
        <SimulatorPage />
      </main>
    </div>
  );
};

export const AppRoutes: Component = () => (
  <>
    <Route path="/" component={DocsRoute} />

    <Route path="/simulador" component={SimulatorRoute} />

    <Route path="*" component={DocsRoute} />
  </>
);

export { AppRoutes as OrbitalJS };
