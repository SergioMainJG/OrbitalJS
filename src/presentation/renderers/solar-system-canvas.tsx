import { onMount, onCleanup, createEffect } from 'solid-js';
import { CanvasRenderer } from './canvas-renderer';
import { AnimationLoop } from '@/core/engines/animation-loop';
import { PhysicsEngine, type IntegratorName } from '@/core/engines/physics-engine';
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
} from '@/features/simulation/stores/simulation-store';
import { setTooltip } from '@/presentation/shared-components/tooltip-store';
import { getHoveredBody } from './body-hit-test';
import { orbitalEnergy } from '@/core/physics/orbital-energy';
import { SpaceshipLauncher } from './spaceship-launcher';
import { drawSpaceship } from './draw-spaceship';
import { SPACESHIP_NAME } from '@/shared/types/spaceship';
import { tickComparison, isComparing } from '@/features/comparison/stores/comparison-store';
import type { RenderBody } from '@/shared/types';

function SolarSystemCanvas() {
  let containerRef: HTMLDivElement | undefined;
  let canvasRef: HTMLCanvasElement | undefined;
  let renderer: CanvasRenderer | null = null;
  let animationLoop: AnimationLoop | null = null;
  let launcher: SpaceshipLauncher | null = null;

  // Dimensiones actuales del canvas (sin DPR) para calcular cx/cy
  let canvasWidth = 800;
  let canvasHeight = 600;

  const physicsEngine = new PhysicsEngine();

  // BUG-2 fix: real physics update using PhysicsEngine
  const updatePhysics = (_wallDt: number) => {
    if (!isRunning()) return;

    const simDt = dt() * simSpeed(); // simulation days per animation frame
    physicsEngine.setIntegrator(integrator() as IntegratorName);

    setBodies((prev) => {
      const next = physicsEngine.step(prev, simDt);
      return next.map((b, i) => ({ ...prev[i]!, ...b }));
    });

    setCurrentDay((d) => d + simDt);

    // Tick comparison if active (through the store function which delegates to engine)
    if (isComparing()) {
      tickComparison(simDt);
    }

    // Collision detection for spaceship
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

    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2;

    const scale = Math.min(canvasWidth, canvasHeight) / 2 / MAX_ORBIT_AU;

    // Construct scene for rendering
    const scene = {
      bodies: bodies().filter((b) => b.name !== SPACESHIP_NAME),
      overlays: [],
      annotations: [],
      metadata: { name: 'solar-system', timeStep: dt(), elapsed: currentDay() },
    };
    renderer.render(scene);

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

    if (launcher) {
      const scale = Math.min(width, height) / 2 / MAX_ORBIT_AU;
      launcher.updateTransform(scale, width / 2, height / 2);
    }

    renderScene();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef || !renderer) return;

    const rect = canvasRef.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const camera = renderer.getCamera();
    const scale = camera.scale;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const hoveredPlanet = getHoveredBody(mouseX, mouseY, bodies(), scale, centerX, centerY);

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

    const scale = Math.min(width, height) / 2 / MAX_ORBIT_AU;
    launcher = new SpaceshipLauncher(canvasRef, context, scale, width / 2, height / 2, {
      onLaunch: (spaceship) => {
        // Issue #9: spaceship mass in M☉ (negligible but non-zero for integrator)
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

    // BUG-2 fix: use real physics loop
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
        // Construct minimal scene for rendering
        const scene = {
          bodies: b.filter((body) => body.name !== SPACESHIP_NAME),
          overlays: [],
          annotations: [],
          metadata: { name: 'solar-system', timeStep: dt(), elapsed: currentDay() },
        };
        renderer.render(scene);
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(containerRef);

    onCleanup(() => {
      animationLoop?.stop();
      launcher?.destroy();
      resizeObserver.disconnect();
    });
  });

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
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        class="block h-full w-full"
      />
    </div>
  );
}

export default SolarSystemCanvas;
