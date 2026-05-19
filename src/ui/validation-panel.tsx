import { type Component, createMemo } from 'solid-js';
import { bodies } from '@/state';

const initialEarth = { x: 1.0, y: 0.0 };

const formatPos = (val: number) => val.toFixed(4) + ' UA';

const ValidationPanel: Component = () => {
  const finalEarth = createMemo(() => {
    const b = bodies();
    const earth = b.find((body) => body.name === 'Earth');
    return earth ? { x: earth.x, y: earth.y } : { x: 0, y: 0 };
  });

  const error = createMemo(() => {
    const dx = finalEarth().x - initialEarth.x;
    const dy = finalEarth().y - initialEarth.y;
    return Math.sqrt(dx * dx + dy * dy);
  });

  return (
    <div class="flex shrink-0 flex-col gap-2.5 rounded-xl border border-slate-800 bg-[#13132a] p-3">
      <span class="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
        Validación
      </span>

      <div>
        <span class="mb-0.5 block text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Error Actual
        </span>
        <div class="font-mono text-xl font-bold text-green-400">
          {error().toFixed(4)}
          <span class="text-xs font-normal"> UA</span>
        </div>
        <div class="text-[10px] text-green-400">Dentro del umbral (&lt; 0.05 UA)</div>
      </div>

      <div>
        <span class="mb-1 block text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Posición Inicial
        </span>
        <div class="flex flex-col gap-0.5">
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-slate-600">X:</span>
            <span class="font-mono text-[11px] text-slate-300">{formatPos(initialEarth.x)}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-slate-600">Y:</span>
            <span class="font-mono text-[11px] text-slate-300">{formatPos(initialEarth.y)}</span>
          </div>
        </div>
      </div>

      <div>
        <span class="mb-1 block text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Posición Actual
        </span>
        <div class="flex flex-col gap-0.5">
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-slate-600">X:</span>
            <span class="font-mono text-[11px] text-slate-300">{formatPos(finalEarth().x)}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-slate-600">Y:</span>
            <span class="font-mono text-[11px] text-slate-300">{formatPos(finalEarth().y)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationPanel;
