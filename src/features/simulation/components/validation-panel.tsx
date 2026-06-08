import { type Component, createMemo } from 'solid-js';
import { bodies, EARTH_INITIAL_POS } from '@/features/simulation/stores/simulation-store';

const formatPos = (val: number) => val.toFixed(4) + ' UA';

const ValidationPanel: Component = () => {
  const finalEarth = createMemo(() => {
    const b = bodies();
    const earth = b.find((body) => body.name === 'Earth');
    return earth ? { x: earth.x, y: earth.y } : { x: 0, y: 0 };
  });

  const error = createMemo(() => {
    const dx = finalEarth().x - EARTH_INITIAL_POS.x;
    const dy = finalEarth().y - EARTH_INITIAL_POS.y;
    return Math.sqrt(dx * dx + dy * dy);
  });

  // Issue #4 fix: conditional coloring based on actual error value
  const isValid = () => error() < 0.05;

  return (
    <div class="flex shrink-0 flex-col gap-2.5 rounded-xl border border-slate-800 bg-[#13132a] p-3">
      <span class="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
        Validación
      </span>

      <div>
        <span class="mb-0.5 block text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Error Actual
        </span>
        <div
          class="font-mono text-xl font-bold tabular-nums"
          classList={{ 'text-green-400': isValid(), 'text-red-400': !isValid() }}
        >
          {error().toFixed(4)}
          <span class="text-xs font-normal"> UA</span>
        </div>
        {/* Issue #4 fix: conditional message */}
        <div
          classList={{ 'text-green-400': isValid(), 'text-red-400': !isValid() }}
          class="text-[10px]"
        >
          {isValid() ? 'Dentro del umbral (< 0.05 UA)' : 'Fuera del umbral — revisar dt'}
        </div>
      </div>

      <div>
        <span class="mb-1 block text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Posición Inicial
        </span>
        <div class="flex flex-col gap-0.5">
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-slate-600">X:</span>
            <span class="font-mono text-[11px] text-slate-300">
              {formatPos(EARTH_INITIAL_POS.x)}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-slate-600">Y:</span>
            <span class="font-mono text-[11px] text-slate-300">
              {formatPos(EARTH_INITIAL_POS.y)}
            </span>
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
