import { type Component, createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
  CategoryScale,
} from 'chart.js';
import { kineticEnergy, potentialEnergy, totalEnergy } from '@/core/physics';
import { energyDrift, getDriftStatus } from '@/core/diagnostics/energy-monitor';
import type { DriftStatus, EnergyPanelProps, EnergySnapshot } from '@/shared/types';
import { SERIES_COLORS } from '@/shared/constants';
import { setTooltip } from '@/presentation/shared-components/tooltip-store';
import { ENERGY_PANEL_TOOLTIP } from '@/shared/constants/math-explanations';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const MAX_HISTORY = 300;

const STATUS_STYLES: Record<DriftStatus, { badge: string; label: string }> = {
  green: { badge: 'badge-success', label: 'Conservacion nominal' },
  yellow: { badge: 'badge-warning', label: 'Deriva moderada' },
  red: { badge: 'badge-error', label: 'RK4 necesita dt mas pequeño' },
};

export const EnergyPanelComponent: Component<EnergyPanelProps> = (props) => {
  let canvasRef: HTMLCanvasElement | undefined;
  let chart: Chart | null = null;

  const [history, setHistory] = createSignal<EnergySnapshot[]>([]);
  const [initialEnergy, setInitialEnergy] = createSignal<number | null>(null);

  const latestSnapshot = () => {
    const h = history();
    return h.length > 0 ? h[h.length - 1]! : null;
  };

  const drift = () => {
    const snap = latestSnapshot();
    const e0 = initialEnergy();
    if (snap === null || e0 === null) return 0;
    return energyDrift(snap.total, e0);
  };

  const status = () => getDriftStatus(drift());

  createEffect(() => {
    const bodies = props.bodies;
    const day = props.currentDay;

    if (!bodies || bodies.length === 0) return;

    const ek = kineticEnergy(bodies);
    const ep = potentialEnergy(bodies);
    const et = totalEnergy(bodies);

    setInitialEnergy((prev) => (prev === null ? et : prev));

    const snap: EnergySnapshot = { day, kinetic: ek, potential: ep, total: et };

    setHistory((prev) => {
      const next = [...prev, snap];
      return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next;
    });
  });

  onMount(() => {
    if (!canvasRef) return;

    const data: ChartData<'line'> = {
      labels: [],
      datasets: [
        {
          label: 'E. cinetica',
          data: [],
          borderColor: SERIES_COLORS.kinetic,
          backgroundColor: `${SERIES_COLORS.kinetic}22`,
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.2,
        },
        {
          label: 'E. potencial',
          data: [],
          borderColor: SERIES_COLORS.potential,
          backgroundColor: `${SERIES_COLORS.potential}22`,
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.2,
        },
        {
          label: 'E. total',
          data: [],
          borderColor: SERIES_COLORS.total,
          backgroundColor: `${SERIES_COLORS.total}22`,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.2,
        },
      ],
    };

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          labels: {
            color: '#cbd5e1',
            font: { family: 'monospace', size: 11 },
            boxWidth: 16,
          },
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#94a3b8',
          bodyColor: '#e2e8f0',
          callbacks: {
            title: (items) => `Dia ${items[0]?.label ?? ''}`,
            label: (item) =>
              ` ${item.dataset.label}: ${(item.parsed.y as number).toExponential(4)}`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: '#64748b', maxTicksLimit: 6, font: { size: 10 } },
          grid: { color: '#1e293b' },
          title: {
            display: true,
            text: 'Tiempo simulado (dias)',
            color: '#64748b',
            font: { size: 10 },
          },
        },
        y: {
          ticks: {
            color: '#64748b',
            font: { size: 10 },
            callback: (v) => (v as number).toExponential(2),
          },
          grid: { color: '#1e293b' },
          title: { display: true, text: 'Energia (u. arb.)', color: '#64748b', font: { size: 10 } },
        },
      },
    };

    chart = new Chart(canvasRef, { type: 'line', data, options });
  });

  createEffect(() => {
    const h = history();
    if (!chart) return;

    chart.data.labels = h.map((s) => String(s.day));
    chart.data.datasets[0]!.data = h.map((s) => s.kinetic);
    chart.data.datasets[1]!.data = h.map((s) => s.potential);
    chart.data.datasets[2]!.data = h.map((s) => s.total);
    chart.update('none');
  });

  onCleanup(() => {
    chart?.destroy();
    chart = null;
  });

  return (
    <div class="bg-base-100/90 flex flex-col gap-3 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold tracking-wide text-slate-300">Monitor de Energia</h2>
        <div class="flex items-center gap-2">
          <button
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltip({
                title: 'Conservacion de Energia',
                x: rect.right + 10,
                y: rect.top,
                content: ENERGY_PANEL_TOOLTIP,
              });
            }}
            onMouseLeave={() => setTooltip(null)}
            class="flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-slate-600 text-[11px] text-slate-400 transition-colors hover:border-yellow-400 hover:text-yellow-400"
          >
            i
          </button>
          <span class={`badge badge-primary h-fit ${STATUS_STYLES[status()].badge}`}>
            {STATUS_STYLES[status()].label}
          </span>
        </div>
      </div>

      <div
        class="flex flex-col items-center rounded-xl py-3"
        classList={{
          'bg-success/10': status() === 'green',
          'bg-warning/10': status() === 'yellow',
          'bg-error/10': status() === 'red',
        }}
        aria-label="Deriva energetica porcentual"
      >
        <span
          class="font-mono text-4xl leading-none font-bold tabular-nums"
          classList={{
            'text-success': status() === 'green',
            'text-warning': status() === 'yellow',
            'text-error': status() === 'red',
          }}
        >
          {drift().toFixed(4)}
          <span class="text-lg font-normal opacity-70">%</span>
        </span>
        <span class="mt-1 text-xs text-slate-500">|E(t) − E(0)| / |E(0)| × 100</span>
      </div>

      <Show when={status() === 'red'}>
        <div
          class="bg-error/15 border-error/40 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs"
          role="alert"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="text-error h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <span class="text-error font-semibold">RK4 necesita dt mas pequeño</span>
        </div>
      </Show>

      <div class="relative h-44 w-full">
        <canvas
          ref={(el) => {
            canvasRef = el;
          }}
          aria-label="Grafica de energia cinetica, potencial y total"
          role="img"
        />
        <Show when={history().length === 0}>
          <div class="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
            Esperando datos de simulacion...
          </div>
        </Show>
      </div>

      <Show when={latestSnapshot()}>
        {(snap) => (
          <dl class="grid grid-cols-3 gap-1 text-center text-xs">
            <div class="rounded-lg bg-slate-800/60 px-2 py-1.5">
              <dt class="text-slate-500">Ecin</dt>
              <dd
                class="font-mono font-semibold tabular-nums"
                style={{ color: SERIES_COLORS.kinetic }}
              >
                {snap().kinetic.toExponential(3)}
              </dd>
            </div>
            <div class="rounded-lg bg-slate-800/60 px-2 py-1.5">
              <dt class="text-slate-500">Epot</dt>
              <dd
                class="font-mono font-semibold tabular-nums"
                style={{ color: SERIES_COLORS.potential }}
              >
                {snap().potential.toExponential(3)}
              </dd>
            </div>
            <div class="rounded-lg bg-slate-800/60 px-2 py-1.5">
              <dt class="text-slate-500">Etotal</dt>
              <dd
                class="font-mono font-semibold tabular-nums"
                style={{ color: SERIES_COLORS.total }}
              >
                {snap().total.toExponential(3)}
              </dd>
            </div>
          </dl>
        )}
      </Show>
    </div>
  );
};

export default EnergyPanelComponent;
