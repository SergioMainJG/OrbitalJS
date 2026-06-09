import { type Component, Suspense } from 'solid-js';
import { DashboardLayout } from '@/presentation/layouts/dashboard-layout';
import Tooltip from '@/presentation/shared-components/tooltip';

const SimulatorFallback: Component = () => (
  <div class="flex h-full w-full items-center justify-center bg-[#0a0a1a]">
    <div class="flex flex-col items-center gap-4">
      <div class="relative flex h-16 w-16 items-center justify-center">
        <div class="h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]" />
        <div class="absolute h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-indigo-400" />
        <div
          class="absolute h-16 w-16 animate-spin rounded-full border border-transparent border-t-purple-500/50"
          style="animation-duration: 2.4s; animation-direction: reverse;"
        />
      </div>
      <p class="text-xs font-semibold tracking-widest text-slate-400 uppercase">
        Cargando simulador…
      </p>
    </div>
  </div>
);

const SimulatorPage: Component = () => (
  <Suspense fallback={<SimulatorFallback />}>
    <DashboardLayout />
    <Tooltip />
  </Suspense>
);

export default SimulatorPage;
