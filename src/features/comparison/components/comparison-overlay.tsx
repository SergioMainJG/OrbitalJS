import { type Component, Show } from 'solid-js';
import { isComparing, comparisonState } from '@/features/comparison/stores/comparison-store';
import { COLORS } from '@/shared/constants';

const ComparisonOverlay: Component = () => {
  return (
    <Show when={isComparing()}>
      <div
        class="bg-base-100/80 pointer-events-none absolute top-3 right-3 flex flex-col gap-1.5 rounded-xl px-4 py-3 text-xs shadow-lg backdrop-blur-sm"
        role="status"
        aria-label="Leyenda modo comparación"
      >
        <div class="flex items-center gap-2">
          <svg width="28" height="8" aria-hidden="true">
            <line
              x1="0"
              y1="4"
              x2="28"
              y2="4"
              stroke={COLORS.rk4}
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          <span>
            RK4{' '}
            <span class="font-mono opacity-70">
              O(Δt<sup>4</sup>)
            </span>
          </span>
        </div>

        <div class="flex items-center gap-2">
          <svg width="28" height="8" aria-hidden="true">
            <line
              x1="0"
              y1="4"
              x2="28"
              y2="4"
              stroke={COLORS.euler}
              stroke-width="2"
              stroke-dasharray="4 3"
              stroke-linecap="round"
            />
          </svg>
          <span>
            Euler <span class="font-mono opacity-70">O(Δt)</span>
          </span>
        </div>

        <div class="border-base-content/10 mt-1 border-t pt-1 text-center opacity-60">
          paso <span class="font-mono font-semibold tabular-nums">{comparisonState.step}</span>
        </div>
      </div>
    </Show>
  );
};

export default ComparisonOverlay;
