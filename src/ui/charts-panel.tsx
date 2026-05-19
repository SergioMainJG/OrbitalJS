import { type Component, createMemo } from 'solid-js';
import { EnergyPanelComponent } from '@/ui/energy-panel';
import { bodies, currentDay } from '@/state';

const ChartsPanel: Component = () => {
  const bodiesForEnergy = createMemo(() =>
    bodies().map(({ name, mass, x, y, vx, vy }) => ({ name, mass, x, y, vx, vy }))
  );

  return (
    <div class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#13132a] p-3">
      <span class="mb-1 block text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
        Gráficas
      </span>
      <div class="panel-scroll min-h-0 flex-1 overflow-auto">
        <EnergyPanelComponent bodies={bodiesForEnergy()} currentDay={currentDay()} />
      </div>
    </div>
  );
};

export default ChartsPanel;
