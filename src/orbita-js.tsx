import { type Component } from 'solid-js';
import SolarSystemCanvas from '@/ui/solar-system-canvas';
import ComparisonOverlay from '@/ui/comparison-overlay';
import CanvasOverlay from '@/ui/canvas-overlay';
import ValidationPanel from '@/ui/validation-panel';
import ChartsPanel from '@/ui/charts-panel';
import LegendPanel from '@/ui/legend-panel';
import SimulationLog from '@/ui/simulation-log';
import LeftPanel from '@/ui/left-panel';

const OrbitalJS: Component = () => {
  return (
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
  );
};

export { OrbitalJS };
