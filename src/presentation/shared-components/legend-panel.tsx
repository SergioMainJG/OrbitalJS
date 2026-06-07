import { type Component } from 'solid-js';
import { simulatedTime } from '@/features/simulation/stores/simulation-store';

const LegendPanel: Component = () => {
  return (
    <div class="flex shrink-0 flex-col gap-2.5 rounded-xl border border-slate-800 bg-[#13132a] p-3">
      <span class="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
        Leyenda
      </span>

      <div class="flex items-center gap-2">
        <div class="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span class="font-mono text-[11px] text-slate-300">Inicio (t = 0 días)</span>
      </div>

      <div class="flex items-center gap-2">
        <div class="h-2.5 w-2.5 rounded-full bg-red-500" />
        <span class="font-mono text-[11px] text-slate-300">Final (t = {simulatedTime()} días)</span>
      </div>

      <div class="flex items-center gap-2">
        <div class="w-5 border-t border-dashed border-orange-400" />
        <span class="font-mono text-[11px] text-slate-300">Órbita de referencia</span>
      </div>

      <div class="flex items-center gap-2">
        <div class="h-3.5 w-3.5 rounded-full bg-yellow-400" />
        <span class="font-mono text-[11px] text-slate-300">Sol</span>
      </div>
    </div>
  );
};

export default LegendPanel;
