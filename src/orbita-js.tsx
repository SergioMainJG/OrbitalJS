import { type Component, onMount } from 'solid-js';
import { DashboardLayout } from '@/presentation/layouts/dashboard-layout';
import { loadScenario } from '@/application/use-cases/load-scenario.use-case';
import { SOLAR_SYSTEM_SCENARIO } from '@/shared/scenarios';

const OrbitalJS: Component = () => {
  onMount(() => {
    loadScenario(SOLAR_SYSTEM_SCENARIO);
  });
  return <DashboardLayout />;
};

export { OrbitalJS };
