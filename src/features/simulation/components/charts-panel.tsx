import { type Component, createMemo } from 'solid-js';
import { EnergyPanelComponent } from '@/features/simulation/components/energy-panel';
import { bodies, currentDay } from '@/features/simulation/stores/simulation-store';

const ChartsPanel: Component = () => {
  const bodiesForEnergy = createMemo(() =>
    bodies().map(({ name, mass, x, y, vx, vy }) => ({ name, mass, x, y, vx, vy }))
  );

  return (
    <div class="flex h-auto w-full flex-col overflow-visible rounded-xl border border-slate-800 bg-[#13132a] p-3 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
      <span class="mb-1 block text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
        Gráficas
      </span>
      <div class="panel-scroll h-auto w-full overflow-visible lg:min-h-0 lg:flex-1 lg:overflow-auto">
        <EnergyPanelComponent bodies={bodiesForEnergy()} currentDay={currentDay()} />
      </div>
    </div>
  );
};

export default ChartsPanel;
