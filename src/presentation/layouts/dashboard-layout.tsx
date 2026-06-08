import { type Component } from 'solid-js';
import SolarSystemCanvas from '@/presentation/renderers/solar-system-canvas';
import ComparisonOverlay from '@/features/comparison/components/comparison-overlay';
import CanvasOverlay from '@/features/simulation/components/canvas-overlay';
import ValidationPanel from '@/features/simulation/components/validation-panel';
import ChartsPanel from '@/features/simulation/components/charts-panel';
import LegendPanel from '@/presentation/shared-components/legend-panel';
import SimulationLog from '@/presentation/shared-components/simulation-log';
import LeftPanel from '@/presentation/layouts/left-panel';
import Tooltip from '@/presentation/shared-components/tooltip';

const DashboardLayout: Component = () => {
  return (
    <>
      <div class="flex h-auto min-h-screen w-full flex-col gap-3 overflow-y-auto bg-[#0a0a1a] p-3 lg:grid lg:h-screen lg:grid-cols-[260px_1fr_300px] lg:grid-rows-[1fr_140px] lg:gap-2 lg:overflow-hidden lg:p-2">
        <div class="flex h-auto w-full flex-col gap-2 overflow-visible lg:col-start-1 lg:row-start-1 lg:row-end-3 lg:h-full lg:overflow-hidden">
          <LeftPanel />
        </div>

        <div class="relative flex h-[55vh] min-h-[380px] w-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#0a0a2a] lg:col-start-2 lg:row-start-1 lg:h-full">
          <CanvasOverlay />
          <SolarSystemCanvas />
          <ComparisonOverlay />
        </div>

        <div class="flex h-auto w-full flex-col gap-2 overflow-visible lg:col-start-3 lg:row-start-1 lg:row-end-3 lg:h-full lg:overflow-hidden">
          <ValidationPanel />
          <ChartsPanel />
          <LegendPanel />
        </div>

        <SimulationLog />
      </div>
      <Tooltip />
    </>
  );
};

export { DashboardLayout };
