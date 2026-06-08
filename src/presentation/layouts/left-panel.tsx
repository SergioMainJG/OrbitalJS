import { type Component } from 'solid-js';
import SimulationControls from '@/features/simulation/components/simulation-controls';
import ComparisonToggle from '@/features/comparison/components/comparison-toggle';
import HowItWorks from '@/features/theory/components/how-it-works';
import { HohmannPanel } from '@/features/simulation/components/hohmann-panel';

const LeftPanel: Component = () => {
  return (
    <div class="panel-scroll flex flex-1 flex-col overflow-y-auto rounded-xl border border-slate-800 bg-[#13132a] p-3">
      <span class="mb-3 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
        Controles
      </span>
      <SimulationControls />
      <div class="mt-4 border-t border-slate-700 pt-4">
        <ComparisonToggle />
      </div>
      <HohmannPanel />
      <HowItWorks />
    </div>
  );
};

export default LeftPanel;
