import { type Component } from 'solid-js';
import SimulationControls from './simulation-controls';

const LeftPanel: Component = () => {
  return (
    <div class="flex flex-1 flex-col rounded-xl border border-slate-800 bg-[#13132a] p-3">
      <span class="mb-3 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
        Controles
      </span>
      <SimulationControls />
    </div>
  );
};

export default LeftPanel;
