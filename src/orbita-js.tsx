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

const OrbitalJS: Component = () => {
  return (
    <>
      <div class="dashboard-grid">
        <div class="panel-left flex flex-col gap-2 overflow-hidden">
          <LeftPanel />
        </div>

        <div class="panel-center relative flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#0a0a2a]">
          <CanvasOverlay />
          <SolarSystemCanvas />
          <ComparisonOverlay />
        </div>

        <div class="panel-right flex flex-col gap-2 overflow-hidden">
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

export { OrbitalJS };
