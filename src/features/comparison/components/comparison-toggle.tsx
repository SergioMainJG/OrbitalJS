import { type Component } from 'solid-js';
import {
  isComparing,
  setIsComparing,
  resetComparison,
} from '@/features/comparison/stores/comparison-store';
import { setTooltip } from '@/presentation/shared-components/tooltip-store';
import {
  COMPARISON_TOOLTIP_EULER,
  COMPARISON_TOOLTIP_RK4,
} from '@/shared/constants/math-explanations';

const ComparisonToggle: Component = () => {
  const handleChange = (e: Event) => {
    const checked = (e.currentTarget as HTMLInputElement).checked;
    if (!checked) resetComparison();
    setIsComparing(checked);
  };

  return (
    <div
      class="relative"
      onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
          title: 'Comparador de Metodos Numericos',
          x: rect.right + 10,
          y: rect.top,
          content: [
            COMPARISON_TOOLTIP_EULER,
            COMPARISON_TOOLTIP_RK4,
            '',
            'Euler: metodo de primer orden, error O(Δt)',
            'RK4: metodo de cuarto orden, error O(Δt⁴)',
          ],
        });
      }}
      onMouseLeave={() => setTooltip(null)}
    >
      <label class="flex cursor-pointer items-center gap-2 select-none">
        <input
          type="checkbox"
          class="toggle toggle-sm"
          checked={isComparing()}
          onChange={handleChange}
          aria-label="Activar modo comparacion Euler vs RK4"
        />
        <span class="text-sm font-medium">Comparar Euler vs RK4</span>
      </label>
    </div>
  );
};

export default ComparisonToggle;
