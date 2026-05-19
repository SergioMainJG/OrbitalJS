import { onMount, onCleanup, createSignal } from 'solid-js';
import { CanvasRenderer } from '../render/canvas-renderer';
import { AnimationLoop } from '../render/animation-loop';
import { getPlanetColor, getPlanetRadius } from '../render/planet-renderer';
import { type RenderBody } from '@/types';

const MAX_ORBIT_AU = 1.52;

const mockBodies: RenderBody[] = [
  {
    name: 'Sun',
    x: 0,
    y: 0,
    radius: getPlanetRadius(1),
    color: getPlanetColor('Sun'),
    mass: 1,
    vx: 0,
    vy: 0,
  },
  {
    name: 'Earth',
    x: 1.0,
    y: 0,
    radius: getPlanetRadius(3e-6),
    color: getPlanetColor('Earth'),
    mass: 3e-6,
    vx: 0,
    vy: 0,
  },
  {
    name: 'Mars',
    x: 1.52,
    y: 0,
    radius: getPlanetRadius(3.2e-7),
    color: getPlanetColor('Mars'),
    mass: 3.2e-7,
    vx: 0,
    vy: 0,
  },
  {
    name: 'Venus',
    x: 0.72,
    y: 0,
    radius: getPlanetRadius(2.4e-6),
    color: getPlanetColor('Venus'),
    mass: 2.4e-6,
    vx: 0,
    vy: 0,
  },
];

export function SolarSystemCanvas() {
  let canvasRef: HTMLCanvasElement | undefined;
  let renderer: CanvasRenderer | null = null;
  let animationLoop: AnimationLoop | null = null;

  const [bodies, setBodies] = createSignal<RenderBody[]>(mockBodies);

  const angles = { Earth: 0, Mars: 0, Venus: 0 };

  const updateMockOrbit = (dt: number) => {
    const speedEarth = (Math.PI * 2) / 5;
    const speedMars = (Math.PI * 2) / 8;
    const speedVenus = (Math.PI * 2) / 3.5;

    angles.Earth += speedEarth * dt;
    angles.Mars += speedMars * dt;
    angles.Venus += speedVenus * dt;

    if (angles.Earth > Math.PI * 2) angles.Earth -= Math.PI * 2;
    if (angles.Mars > Math.PI * 2) angles.Mars -= Math.PI * 2;
    if (angles.Venus > Math.PI * 2) angles.Venus -= Math.PI * 2;

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
    if (!context) return;

    const rect = canvasRef.parentElement?.getBoundingClientRect();
    const width = rect?.width || window.innerWidth;
    const height = rect?.height || window.innerHeight;

    renderer = new CanvasRenderer(canvasRef, width, height, context, MAX_ORBIT_AU);
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
