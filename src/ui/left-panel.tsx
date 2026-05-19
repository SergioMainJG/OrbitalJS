import { type Component } from 'solid-js';

const LeftPanel: Component = () => {
  return (
    <div class="flex flex-1 flex-col rounded-xl border border-slate-800 bg-[#13132a] p-3">
      <span class="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
        Controles
      </span>
    </div>
  );
};

export default LeftPanel;
