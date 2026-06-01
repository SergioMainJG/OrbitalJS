import { type Component } from 'solid-js';
import SimulationControls from './simulation-controls';
import ComparisonToggle from './comparison-toggle';
import HowItWorks from './how-it-works';

const LeftPanel: Component = () => {
  return (
    <div class="flex flex-1 flex-col rounded-xl border border-slate-800 bg-[#13132a] p-3">
      <span class="mb-3 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
        Controles
      </span>
      <SimulationControls />
      <div class="mt-4 border-t border-slate-700 pt-4">
        <ComparisonToggle />
      </div>
      <div class="mt-2">
        <HowItWorks />
      </div>
    </div>
  );
};

export default LeftPanel;
