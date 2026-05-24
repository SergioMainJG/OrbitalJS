import { onMount, onCleanup, createEffect } from 'solid-js';
import { CanvasRenderer } from '@/render/canvas-renderer';
import { AnimationLoop } from '@/render/animation-loop';
import { bodies, setBodies, setCurrentDay, simSpeed, MAX_ORBIT_AU, isRunning } from '@/state';

export const canvasState = {
  angles: { Earth: 0, Mars: 0, Venus: 0 },
  dayCounter: 0,
};

function SolarSystemCanvas() {
  let containerRef: HTMLDivElement | undefined;
  let canvasRef: HTMLCanvasElement | undefined;
  let renderer: CanvasRenderer | null = null;
  let animationLoop: AnimationLoop | null = null;

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
          return {
            ...body,
            x: Math.cos(canvasState.angles.Earth) * 1.0,
            y: Math.sin(canvasState.angles.Earth) * 1.0,
          };
        }
        if (body.name === 'Mars') {
          return {
            ...body,
            x: Math.cos(canvasState.angles.Mars) * 1.52,
            y: Math.sin(canvasState.angles.Mars) * 1.52,
          };
        }
        if (body.name === 'Venus') {
          return {
            ...body,
            x: Math.cos(canvasState.angles.Venus) * 0.72,
            y: Math.sin(canvasState.angles.Venus) * 0.72,
          };
        }
        return body;
      })
    );
  };

  const renderScene = () => {
    if (renderer) {
      renderer.render(bodies());
    }
  };

  const resizeCanvas = () => {
    if (!containerRef || !canvasRef || !renderer) return;

    const rect = containerRef.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width;
    const height = rect.height;

    if (width === 0 || height === 0) return;

    canvasRef.width = Math.round(width * dpr);
    canvasRef.height = Math.round(height * dpr);

    const ctx = canvasRef.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    renderer.resize(width, height);
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

    canvasRef.width = Math.round(width * dpr);
    canvasRef.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    renderer = new CanvasRenderer(canvasRef, width, height, context, MAX_ORBIT_AU);
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
