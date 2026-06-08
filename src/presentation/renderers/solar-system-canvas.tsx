import { onMount, onCleanup, createEffect } from 'solid-js';
import { CanvasRenderer } from './canvas-renderer';
import { AnimationLoop } from '@/core/engines/animation-loop';
import { PhysicsEngine, type IntegratorName } from '@/core/engines/physics-engine';
import { rendererRegistry } from '@/application/registries/renderer-registry';
import {
  bodies,
  setBodies,
  setCurrentDay,
  currentDay,
  simSpeed,
  MAX_ORBIT_AU,
  isRunning,
  dt,
  integrator,
  EARTH_INITIAL_POS,
} from '@/features/simulation/stores/simulation-store';
import { setTooltip } from '@/presentation/shared-components/tooltip-store';
import { getHoveredBody } from './body-hit-test';
import { orbitalEnergy } from '@/core/physics/orbital-energy';
import { SpaceshipLauncher } from './spaceship-launcher';
import { drawSpaceship } from './draw-spaceship';
import { SPACESHIP_NAME } from '@/shared/types/spaceship';
import {
  tickComparison,
  isComparing,
  comparisonState,
} from '@/features/comparison/stores/comparison-store';
import { COLORS, STYLES, UNIVERSAL_CONSTS } from '@/shared/constants';
import type { RenderBody } from '@/shared/types';
import type { Scene } from '@/shared/types/scene';

const { MAX_DT_EULER, MAX_DT_RK4 } = UNIVERSAL_CONSTS;

function buildScene(allBodies: RenderBody[], timeStep: number, elapsed: number): Scene {
  return {
    bodies: allBodies.filter((b) => b.name !== SPACESHIP_NAME),
    overlays: [],
    annotations: [],
    metadata: { name: 'solar-system', timeStep, elapsed },
  };
}

// ---------------------------------------------------------------------------
// BUG FIX: Draw comparison trails directly on canvas
// ---------------------------------------------------------------------------
function drawComparisonTrails(
  ctx: CanvasRenderingContext2D,
  scale: number,
  cx: number,
  cy: number
): void {
  const state = comparisonState;

  // RK4 trails — solid blue
  for (const trail of state.rk4Trails) {
    if (trail.length < 2) continue;
    ctx.save();
    ctx.setLineDash([]);
    ctx.lineWidth = STYLES.rk4.lineWidth;
    for (let i = 1; i < trail.length; i++) {
      const opacity = i / trail.length;
      const prev = trail[i - 1]!;
      const curr = trail[i]!;
      ctx.beginPath();
      ctx.moveTo(cx + prev.x * scale, cy - prev.y * scale);
      ctx.lineTo(cx + curr.x * scale, cy - curr.y * scale);
      ctx.strokeStyle = `${COLORS.rk4}${Math.floor(opacity * 200)
        .toString(16)
        .padStart(2, '0')}`;
      ctx.stroke();
    }
    ctx.restore();
  }

  // Euler trails — dashed red
  for (const trail of state.eulerTrails) {
    if (trail.length < 2) continue;
    ctx.save();
    ctx.setLineDash([4, 3]);
    ctx.lineWidth = STYLES.euler.lineWidth;
    for (let i = 1; i < trail.length; i++) {
      const opacity = i / trail.length;
      const prev = trail[i - 1]!;
      const curr = trail[i]!;
      ctx.beginPath();
      ctx.moveTo(cx + prev.x * scale, cy - prev.y * scale);
      ctx.lineTo(cx + curr.x * scale, cy - curr.y * scale);
      ctx.strokeStyle = `${COLORS.euler}${Math.floor(opacity * 200)
        .toString(16)
        .padStart(2, '0')}`;
      ctx.stroke();
    }
    ctx.restore();
  }

  // Current body dots
  for (const body of state.rk4Bodies) {
    const px = cx + body.x * scale;
    const py = cy - body.y * scale;
    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.rk4;
    ctx.fill();
    ctx.restore();
  }

  for (const body of state.eulerBodies) {
    const px = cx + body.x * scale;
    const py = cy - body.y * scale;
    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.euler;
    ctx.fill();
    ctx.restore();
  }
}

function SolarSystemCanvas() {
  let containerRef: HTMLDivElement | undefined;
  let canvasRef: HTMLCanvasElement | undefined;
  let renderer: CanvasRenderer | null = null;
  let animationLoop: AnimationLoop | null = null;
  let launcher: SpaceshipLauncher | null = null;

  let canvasWidth = 800;
  let canvasHeight = 600;

  let isPanning = false;
  let startX = 0;
  let startY = 0;

  const physicsEngine = new PhysicsEngine();

  const updatePhysics = (_wallDt: number) => {
    if (!isRunning()) return;

    const currentIntegrator = integrator() as IntegratorName;
    physicsEngine.setIntegrator(currentIntegrator);

    // BUG FIX: Clamp the effective simulation timestep per integrator.
    // At simSpeed=10x, dt*simSpeed = 5 days which is fine for RK4 but
    // catastrophically unstable for Euler (planets shoot off to infinity).
    const rawDt = dt() * simSpeed();
    const maxDt = currentIntegrator === 'Euler' ? MAX_DT_EULER : MAX_DT_RK4;
    const simDt = Math.min(rawDt, maxDt);

    setBodies((prev) => {
      const next = physicsEngine.step(prev, simDt);
      return next.map((b, i) => ({ ...prev[i]!, ...b }));
    });

    setCurrentDay((d) => d + simDt);

    if (isComparing()) {
      // Use the same clamped dt for the comparison engine
      tickComparison(Math.min(rawDt, MAX_DT_EULER));
    }

    if (launcher) {
      const next = launcher.checkCollisions(bodies());
      if (next.length !== bodies().length) {
        setBodies(next as RenderBody[]);
      }
    }
  };

  const renderScene = () => {
    if (!renderer || !canvasRef) return;

    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;

    const camera = renderer.getCamera();
    const scale = camera.scale;
    const { cx, cy } = camera.getCenter();

    renderer.render(buildScene(bodies(), dt(), currentDay()));

    // BUG FIX: draw comparison trails on every frame when active
    if (isComparing()) {
      drawComparisonTrails(ctx, scale, cx, cy);
    }

    // Draw Earth initial position (INICIO green marker) directly on canvas
    const earthInitialX = EARTH_INITIAL_POS.x;
    const earthInitialY = EARTH_INITIAL_POS.y;
    const initialPx = cx + earthInitialX * scale;
    const initialPy = cy - earthInitialY * scale;

    ctx.save();
    ctx.beginPath();
    ctx.arc(initialPx, initialPy, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#4ade80';
    ctx.fill();

    ctx.fillStyle = '#4ade80';
    ctx.font = '10px monospace';
    ctx.fillText('INICIO', initialPx - 18, initialPy - 8);
    ctx.restore();

    const ship = bodies().find((b) => b.name === SPACESHIP_NAME);
    if (ship) {
      drawSpaceship(ctx, ship, scale, cx, cy);
    }

    launcher?.drawOverlay();
  };

  const resizeCanvas = () => {
    if (!containerRef || !canvasRef || !renderer) return;

    const rect = containerRef.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width;
    const height = rect.height;

    if (width === 0 || height === 0) return;

    canvasWidth = width;
    canvasHeight = height;

    canvasRef.width = Math.round(width * dpr);
    canvasRef.height = Math.round(height * dpr);

    const ctx = canvasRef.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    renderer.resize(width, height);

    const camera = renderer.getCamera();
    if (launcher) {
      const { cx, cy } = camera.getCenter();
      launcher.updateTransform(camera.scale, cx, cy);
    }

    renderScene();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef || !renderer) return;

    const rect = canvasRef.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const camera = renderer.getCamera();

    if (isPanning) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      camera.pan(dx, dy);

      startX = e.clientX;
      startY = e.clientY;

      const { cx, cy } = camera.getCenter();
      launcher?.updateTransform(camera.scale, cx, cy);

      renderScene();
      return;
    }

    const scale = camera.scale;
    const { cx, cy } = camera.getCenter();

    const hoveredPlanet = getHoveredBody(mouseX, mouseY, bodies(), scale, cx, cy);

    if (hoveredPlanet) {
      const energy = orbitalEnergy(hoveredPlanet);
      const v = Math.sqrt(
        hoveredPlanet.vx * hoveredPlanet.vx + hoveredPlanet.vy * hoveredPlanet.vy
      );
      const r = Math.sqrt(hoveredPlanet.x * hoveredPlanet.x + hoveredPlanet.y * hoveredPlanet.y);

      setTooltip({
        title: `🪐 ${hoveredPlanet.name}`,
        x: e.clientX,
        y: e.clientY,
        content: [
          `Masa: ${hoveredPlanet.mass.toExponential(2)} M☉`,
          `Velocidad: ${v.toFixed(4)} UA/dia`,
          `Distancia al Sol: ${r.toFixed(3)} UA`,
          `Energia especifica: ${energy.toFixed(6)}`,
          ``,
          `ε = v²/2 - GM/r`,
          `En sistemas conservativos, E = constante`,
        ],
      });
    } else {
      setTooltip(null);
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
    if (isPanning) {
      isPanning = false;
    }
  };

  onMount(() => {
    if (!canvasRef || !containerRef) return;

    const context = canvasRef.getContext('2d');
    if (!context) return;

    const rect = containerRef.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width || containerRef.clientWidth || 800;
    const height = rect.height || containerRef.clientHeight || 600;

    canvasWidth = width;
    canvasHeight = height;

    canvasRef.width = Math.round(width * dpr);
    canvasRef.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    renderer = new CanvasRenderer(canvasRef, width, height, context, MAX_ORBIT_AU);
    renderer.initialize();
    rendererRegistry.register('canvas', renderer);

    const camera = renderer.getCamera();
    const { cx, cy } = camera.getCenter();
    launcher = new SpaceshipLauncher(canvasRef, context, camera.scale, cx, cy, {
      onLaunch: (spaceship) => {
        const spaceshipRender: RenderBody = {
          ...spaceship,
          mass: 1e-25,
          radius: 4,
          color: '#00ffff',
        };
        setBodies([...bodies(), spaceshipRender]);
      },
      onCancel: () => {
        setBodies(bodies().filter((b) => b.name !== SPACESHIP_NAME));
      },
      onImpact: (bodyName) => {
        console.info(`[SpaceshipLauncher] Impacto con ${bodyName}`);
      },
    });

    // BUG FIX: attach launcher to canvas element so SimulationControls can reset it
    (canvasRef as HTMLCanvasElement & { launcherInstance?: SpaceshipLauncher }).launcherInstance =
      launcher;

    canvasRef.addEventListener('wheel', handleWheel, { passive: false });

    animationLoop = new AnimationLoop(updatePhysics, renderScene);
    animationLoop.start();

    createEffect(() => {
      if (isRunning()) {
        animationLoop?.start();
      } else {
        animationLoop?.stop();
      }
    });

    createEffect(() => {
      const b = bodies();
      if (!isRunning() && renderer) {
        renderer.render(buildScene(b, dt(), currentDay()));
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(containerRef);

    onCleanup(() => {
      if (canvasRef) {
        canvasRef.removeEventListener('wheel', handleWheel);
      }
      animationLoop?.stop();
      launcher?.destroy();
      resizeObserver.disconnect();
    });
  });

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button === 2 || (e.button === 0 && e.shiftKey)) {
      isPanning = true;
      startX = e.clientX;
      startY = e.clientY;
      setTooltip(null);
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      isPanning = false;
    }
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (!renderer) return;

    const rect = canvasRef!.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const camera = renderer.getCamera();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 1 / 1.15;

    camera.zoom(zoomFactor, mouseX, mouseY);

    const { cx, cy } = camera.getCenter();
    launcher?.updateTransform(camera.scale, cx, cy);

    renderScene();
  };

  const handleZoomButton = (factor: number) => {
    if (!renderer) return;
    const camera = renderer.getCamera();
    camera.zoom(factor, canvasWidth / 2, canvasHeight / 2);

    const { cx, cy } = camera.getCenter();
    launcher?.updateTransform(camera.scale, cx, cy);
    renderScene();
  };

  const handleResetZoom = () => {
    if (!renderer) return;
    const camera = renderer.getCamera();
    camera.autoScale(MAX_ORBIT_AU);

    const { cx, cy } = camera.getCenter();
    launcher?.updateTransform(camera.scale, cx, cy);
    renderScene();
  };

  return (
    <div
      ref={(el) => {
        containerRef = el;
      }}
      class="relative h-full min-h-0 w-full overflow-hidden"
    >
      <canvas
        ref={(el) => {
          canvasRef = el;
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        class="block h-full w-full"
      />

      {/* Floating Zoom and Reset Controls */}
      <div class="absolute right-3 bottom-3 z-10 flex flex-col gap-1 rounded-lg border border-slate-800 bg-slate-950/80 p-1 shadow-lg backdrop-blur-md">
        <button
          onClick={() => handleZoomButton(1.3)}
          class="flex h-7 w-7 items-center justify-center rounded bg-slate-900 text-sm font-bold text-slate-200 transition-colors hover:bg-slate-800 hover:text-white"
          title="Acercar (Zoom In)"
        >
          ＋
        </button>
        <button
          onClick={() => handleZoomButton(1 / 1.3)}
          class="flex h-7 w-7 items-center justify-center rounded bg-slate-900 text-sm font-bold text-slate-200 transition-colors hover:bg-slate-800 hover:text-white"
          title="Alejar (Zoom Out)"
        >
          －
        </button>
        <button
          onClick={handleResetZoom}
          class="flex h-7 w-7 items-center justify-center rounded bg-slate-900 text-sm font-bold text-slate-200 transition-colors hover:bg-slate-800 hover:text-white"
          title="Centrar / Reset Zoom"
        >
          ⌖
        </button>
      </div>
    </div>
  );
}

export default SolarSystemCanvas;
