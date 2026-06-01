import { onMount, onCleanup, createEffect } from 'solid-js';
import { CanvasRenderer } from '@/render/canvas-renderer';
import { AnimationLoop } from '@/render/animation-loop';
import { bodies, setBodies, setCurrentDay, simSpeed, MAX_ORBIT_AU, isRunning } from '@/state';
import { setTooltip } from '@/state/tooltip-store';
import { getHoveredPlanet } from '@/render/planet-hit-test';
import { orbitalEnergy } from '@/physics/orbital-energy';

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
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        class="block h-full w-full"
      />
    </div>
  );
}

export default SolarSystemCanvas;
