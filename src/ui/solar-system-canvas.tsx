import { onMount, onCleanup, createEffect } from 'solid-js';
import { CanvasRenderer } from '@/render/canvas-renderer';
import { AnimationLoop } from '@/render/animation-loop';
import { bodies, setBodies, setCurrentDay, simSpeed, MAX_ORBIT_AU, isRunning } from '@/state';
import { setTooltip } from '@/state/tooltip-store';
import { getHoveredPlanet } from '@/render/planet-hit-test';
import { orbitalEnergy } from '@/physics/orbital-energy';
import { SpaceshipLauncher } from '@/render/spaceship-launcher';
import { drawSpaceship } from '@/render/draw-spaceship';
import { SPACESHIP_NAME } from '@/types/spaceship';
import type { RenderBody } from '@/types';

export const canvasState = {
  angles: { Earth: 0, Mars: 0, Venus: 0 },
  dayCounter: 0,
};

function SolarSystemCanvas() {
  let containerRef: HTMLDivElement | undefined;
  let canvasRef: HTMLCanvasElement | undefined;
  let renderer: CanvasRenderer | null = null;
  let animationLoop: AnimationLoop | null = null;
  let launcher: SpaceshipLauncher | null = null;

  // Dimensiones actuales del canvas (sin DPR) para calcular cx/cy
  let canvasWidth = 800;
  let canvasHeight = 600;

  const updateMockOrbit = (dt: number) => {
    const speed = simSpeed();

    const speedEarth = (Math.PI * 2) / 5;
    const speedMars = (Math.PI * 2) / 8;
    const speedVenus = (Math.PI * 2) / 3.5;

    canvasState.angles.Earth += speedEarth * dt * speed;
    canvasState.angles.Mars += speedMars * dt * speed;
    canvasState.angles.Venus += speedVenus * dt * speed;

    if (canvasState.angles.Earth > Math.PI * 2) canvasState.angles.Earth -= Math.PI * 2;
    if (canvasState.angles.Mars > Math.PI * 2) canvasState.angles.Mars -= Math.PI * 2;
    if (canvasState.angles.Venus > Math.PI * 2) canvasState.angles.Venus -= Math.PI * 2;

    canvasState.dayCounter += dt * speed;
    setCurrentDay(canvasState.dayCounter);

    setBodies((prev) =>
      prev.map((body) => {
        if (body.name === 'Earth') {
          const angle = canvasState.angles.Earth;
          const x = Math.cos(angle) * 1.0;
          const y = Math.sin(angle) * 1.0;
          const vx = -Math.sin(angle) * 1.0;
          const vy = Math.cos(angle) * 1.0;
          return { ...body, x, y, vx, vy };
        }
        if (body.name === 'Mars') {
          const angle = canvasState.angles.Mars;
          const x = Math.cos(angle) * 1.52;
          const y = Math.sin(angle) * 1.52;
          const vx = -Math.sin(angle) * 1.19;
          const vy = Math.cos(angle) * 1.19;
          return { ...body, x, y, vx, vy };
        }
        if (body.name === 'Venus') {
          const angle = canvasState.angles.Venus;
          const x = Math.cos(angle) * 0.72;
          const y = Math.sin(angle) * 0.72;
          const vx = -Math.sin(angle) * 1.29;
          const vy = Math.cos(angle) * 1.29;
          return { ...body, x, y, vx, vy };
        }
        return body;
      })
    );

    // Verificar colisiones de la nave en cada tick de física
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

    renderer.render(bodies().filter((b) => b.name !== SPACESHIP_NAME));

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

    const hoveredPlanet = getHoveredPlanet(mouseX, mouseY, bodies(), scale, centerX, centerY);

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

    const scale = Math.min(width, height) / 2 / MAX_ORBIT_AU;
    launcher = new SpaceshipLauncher(canvasRef, context, scale, width / 2, height / 2, {
      onLaunch: (spaceship) => {
        const spaceshipRender = {
          ...spaceship,
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

    animationLoop = new AnimationLoop(updateMockOrbit, renderScene);
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
        renderer.render(b);
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
