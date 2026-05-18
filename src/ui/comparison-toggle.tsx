import { type Component } from 'solid-js';
import { isComparing, setIsComparing, resetComparison } from '@/render';

const ComparisonToggle: Component = () => {
  const handleChange = (e: Event) => {
    const checked = (e.currentTarget as HTMLInputElement).checked;
    if (!checked) resetComparison();
    setIsComparing(checked);
  };

  return (
    <label class="flex cursor-pointer items-center gap-2 select-none">
      <input
        type="checkbox"
        class="toggle toggle-sm"
        checked={isComparing()}
        onChange={handleChange}
        aria-label="Activar modo comparación Euler vs RK4"
      />
      <span class="text-sm font-medium">Comparar Euler vs RK4</span>
    </label>
  );
};

export default ComparisonToggle;
