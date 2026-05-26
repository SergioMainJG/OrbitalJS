import { onMount, onCleanup } from 'solid-js';
import { CanvasRenderer } from '@/render/canvas-renderer';
import { AnimationLoop } from '@/render/animation-loop';
import { bodies, setBodies, setCurrentDay, simSpeed, MAX_ORBIT_AU } from '@/state';
import { SpaceshipLauncher } from '@/render/spaceship-launcher';
import { drawSpaceship } from '@/render/draw-spaceship';
import { SPACESHIP_NAME } from '@/types/spaceship';
import type { RenderBody } from '@/types';

const angles = { Earth: 0, Mars: 0, Venus: 0 };
let dayCounter = 0;

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

    angles.Earth += speedEarth * dt * speed;
    angles.Mars += speedMars * dt * speed;
    angles.Venus += speedVenus * dt * speed;

    if (angles.Earth > Math.PI * 2) angles.Earth -= Math.PI * 2;
    if (angles.Mars > Math.PI * 2) angles.Mars -= Math.PI * 2;
    if (angles.Venus > Math.PI * 2) angles.Venus -= Math.PI * 2;

    dayCounter += dt * speed;
    setCurrentDay(dayCounter);

    setBodies((prev) =>
      prev.map((body) => {
        if (body.name === 'Earth') {
          return { ...body, x: Math.cos(angles.Earth) * 1.0, y: Math.sin(angles.Earth) * 1.0 };
        }
        if (body.name === 'Mars') {
          return { ...body, x: Math.cos(angles.Mars) * 1.52, y: Math.sin(angles.Mars) * 1.52 };
        }
        if (body.name === 'Venus') {
          return { ...body, x: Math.cos(angles.Venus) * 0.72, y: Math.sin(angles.Venus) * 0.72 };
        }
        return body;
      })
    );

    // Verificar colisiones de la nave en cada tick de física
    if (launcher) {
      const next = launcher.checkCollisions(bodies());
      // Solo actualizar si la nave fue removida (colisión detectada)
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

    // Escala: misma lógica que CanvasRenderer.camera.autoScale
    // px por AU → Math.min(w, h) / 2 / maxOrbitAU
    const scale = Math.min(canvasWidth, canvasHeight) / 2 / MAX_ORBIT_AU;

    // Renderizar planetas (excluir nave — tiene su propio draw)
    renderer.render(bodies().filter((b) => b.name !== SPACESHIP_NAME));

    // Renderizar nave si está en vuelo
    const ship = bodies().find((b) => b.name === SPACESHIP_NAME);
    if (ship) {
      drawSpaceship(ctx, ship, scale, cx, cy);
    }

    // Overlay: flecha de aiming o mensaje de impacto
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

    // Actualizar transform del launcher al hacer resize
    if (launcher) {
      const scale = Math.min(width, height) / 2 / MAX_ORBIT_AU;
      launcher.updateTransform(scale, width / 2, height / 2);
    }

    renderScene();
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

    // Inicializar launcher con la escala y centro actuales
    const scale = Math.min(width, height) / 2 / MAX_ORBIT_AU;
    launcher = new SpaceshipLauncher(canvasRef, context, scale, width / 2, height / 2, {
      onLaunch: (spaceship) => {
        // RenderBody requiere radius y color además de BodyState
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
        class="block h-full w-full"
      />
    </div>
  );
}

export default SolarSystemCanvas;
