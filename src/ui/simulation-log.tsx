import { type Component, For } from 'solid-js';
import { logMessages } from '@/state';

const assignColor = (msg: string): string => {
  if (msg.includes('ERROR')) return 'text-red-500';
  if (msg.includes('WARN')) return 'text-yellow-500';
  return '';
};

const SimulationLog: Component = () => {
  return (
    <div class="panel-log flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#13132a] px-3.5 py-2.5">
      <span class="mb-1.5 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
        Log de Simulación
      </span>
      <div class="panel-scroll flex flex-col gap-0.5 overflow-auto font-mono text-[11px] text-slate-400">
        <For each={logMessages()}>{(msg) => <div class={assignColor(msg)}>{msg}</div>}</For>
      </div>
    </div>
  );
};

export default SimulationLog;
