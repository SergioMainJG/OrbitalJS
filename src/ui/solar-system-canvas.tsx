import { onMount, onCleanup } from 'solid-js';
import { CanvasRenderer } from '@/render/canvas-renderer';
import { AnimationLoop } from '@/render/animation-loop';
import { bodies, setBodies, setCurrentDay, simSpeed, MAX_ORBIT_AU } from '@/state';

const angles = { Earth: 0, Mars: 0, Venus: 0 };
let dayCounter = 0;

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
