import { onMount, onCleanup, createSignal } from 'solid-js';
import { CanvasRenderer } from '../render/canvas-renderer';
import type { RenderBody } from '../render/render-body.interface';
import { AnimationLoop } from '../render/animation-loop';

const mockBodies: RenderBody[] = [
  { name: 'SOL', x: 0, y: 0, radius: 18, color: '#FDB813', mass: 1, vx: 0, vy: 0 },
  { name: 'TIERRA', x: 1.0, y: 0, radius: 6, color: '#4B9CD3', mass: 1, vx: 0, vy: 0 },
  { name: 'MARTE', x: 1.52, y: 0, radius: 5, color: '#E8734A', mass: 1, vx: 0, vy: 0 },
  { name: 'VENUS', x: 0.72, y: 0, radius: 5, color: '#E6B800', mass: 1, vx: 0, vy: 0 },
];

export function SolarSystemCanvas() {
  let canvasRef: HTMLCanvasElement | undefined;
  let renderer: CanvasRenderer | null = null;
  let animationLoop: AnimationLoop | null = null;

  const [bodies, setBodies] = createSignal<RenderBody[]>(mockBodies);

  const angles = {
    TIERRA: 0,
    MARTE: 0,
    VENUS: 0,
  };

  const updateMockOrbit = (dt: number) => {
    const speedEarth = (Math.PI * 2) / 5;
    const speedMars = (Math.PI * 2) / 8;
    const speedVenus = (Math.PI * 2) / 3.5;

    angles.TIERRA += speedEarth * dt;
    angles.MARTE += speedMars * dt;
    angles.VENUS += speedVenus * dt;

    if (angles.TIERRA > Math.PI * 2) angles.TIERRA -= Math.PI * 2;
    if (angles.MARTE > Math.PI * 2) angles.MARTE -= Math.PI * 2;
    if (angles.VENUS > Math.PI * 2) angles.VENUS -= Math.PI * 2;

    setBodies((prev) =>
      prev.map((body) => {
        if (body.name === 'TIERRA') {
          return { ...body, x: Math.cos(angles.TIERRA) * 1.0, y: Math.sin(angles.TIERRA) * 1.0 };
        }
        if (body.name === 'MARTE') {
          return { ...body, x: Math.cos(angles.MARTE) * 1.52, y: Math.sin(angles.MARTE) * 1.52 };
        }
        if (body.name === 'VENUS') {
          return { ...body, x: Math.cos(angles.VENUS) * 0.72, y: Math.sin(angles.VENUS) * 0.72 };
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

  const handleResize = () => {
    if (renderer && canvasRef !== undefined) {
      const rect = canvasRef.parentElement?.getBoundingClientRect();
      if (rect) {
        renderer.resize(rect.width, rect.height);
        renderScene();
      }
    }
  };

  onMount(() => {
    if (!canvasRef) return;

    const context = canvasRef.getContext('2d');

    if (!context) {
      return;
    }

    const rect = canvasRef.parentElement?.getBoundingClientRect();
    const width = rect?.width || window.innerWidth;
    const height = rect?.height || window.innerHeight;

    renderer = new CanvasRenderer(canvasRef, width, height, context);
    animationLoop = new AnimationLoop(updateMockOrbit, renderScene);
    animationLoop.start();

    window.addEventListener('resize', handleResize);
  });

  onCleanup(() => {
    animationLoop?.stop();
    window.removeEventListener('resize', handleResize);
  });

  return (
    <canvas
      ref={(el) => {
        canvasRef = el;
      }}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    />
  );
}
