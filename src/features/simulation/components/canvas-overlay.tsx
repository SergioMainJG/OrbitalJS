import { type Component, createMemo } from 'solid-js';
import { bodies, EARTH_INITIAL_POS } from '@/features/simulation/stores/simulation-store';

const CanvasOverlay: Component = () => {
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

  return (
    <>
      <div class="absolute top-2 left-3 z-10 rounded bg-[#0a0a2a]/80 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
        Vista 2D
      </div>

      <div class="absolute top-2 right-3 z-10 rounded bg-[#0a0a2a]/80 px-2 py-0.5 text-right">
        <div class="text-[11px] text-orange-400">ERROR: {error().toFixed(4)} UA</div>
        <div class="text-[10px] text-red-500">FINAL</div>
      </div>
    </>
  );
};

export default CanvasOverlay;
