import { onMount, onCleanup, createEffect, batch, untrack } from 'solid-js';
import { CanvasRenderer } from './canvas-renderer';
import { AnimationLoop } from '@/core/engines/animation-loop';
import { rendererRegistry } from '@/application/registries/renderer-registry';
import { simulationRuntime } from '@/core/engines/simulation-runtime';
import type { IntegratorName } from '@/core/engines/physics-engine';
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
  showOrbit,
  showTrajectory,
  followSpaceship,
  showLagrange,
  showHohmann,
  hohmannParams,
  addLogMessage,
  setIsRunning,
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
import type { RenderBody, BodyState } from '@/shared/types';
import type { Scene } from '@/shared/types/scene';

const { MAX_DT_EULER, MAX_DT_RK4 } = UNIVERSAL_CONSTS;

function buildScene(allBodies: RenderBody[], timeStep: number, elapsed: number): Scene {
  return {
    bodies: allBodies.filter((b) => !b.name.startsWith(SPACESHIP_NAME)),
    overlays: [],
    annotations: [],
    metadata: { name: 'solar-system', timeStep, elapsed },
  };
}

function drawComparisonTrails(
  ctx: CanvasRenderingContext2D,
  scale: number,
  cx: number,
  cy: number
): void {
  const state = comparisonState;

  const BUCKET_SIZE = 5;

  for (const trail of state.rk4Trails) {
    if (trail.length < 2) continue;
    ctx.save();
    ctx.setLineDash([]);
    ctx.lineWidth = STYLES.rk4.lineWidth;
    for (let i = 1; i < trail.length; i += BUCKET_SIZE) {
      const bucketEnd = Math.min(i + BUCKET_SIZE, trail.length);
      const opacity = (i + Math.floor(BUCKET_SIZE / 2)) / trail.length;
      const prev = trail[i - 1]!;
      ctx.beginPath();
      ctx.moveTo(cx + prev.x * scale, cy - prev.y * scale);
      for (let j = i; j < bucketEnd; j++) {
        const curr = trail[j]!;
        ctx.lineTo(cx + curr.x * scale, cy - curr.y * scale);
      }
      ctx.strokeStyle = `${COLORS.rk4}${Math.floor(opacity * 200)
        .toString(16)
        .padStart(2, '0')}`;
      ctx.stroke();
    }
    ctx.restore();
  }

  for (const trail of state.eulerTrails) {
    if (trail.length < 2) continue;
    ctx.save();
    ctx.setLineDash([4, 3]);
    ctx.lineWidth = STYLES.euler.lineWidth;
    for (let i = 1; i < trail.length; i += BUCKET_SIZE) {
      const bucketEnd = Math.min(i + BUCKET_SIZE, trail.length);
      const opacity = (i + Math.floor(BUCKET_SIZE / 2)) / trail.length;
      const prev = trail[i - 1]!;
      ctx.beginPath();
      ctx.moveTo(cx + prev.x * scale, cy - prev.y * scale);
      for (let j = i; j < bucketEnd; j++) {
        const curr = trail[j]!;
        ctx.lineTo(cx + curr.x * scale, cy - curr.y * scale);
      }
      ctx.strokeStyle = `${COLORS.euler}${Math.floor(opacity * 200)
        .toString(16)
        .padStart(2, '0')}`;
      ctx.stroke();
    }
    ctx.restore();
  }

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

  let lastTouchDist = 0;
  let lastTouchX = 0;
  let lastTouchY = 0;
  let isTouchZooming = false;

  const updatePhysics = (_wallDt: number) => {
    if (!isRunning()) return;

    const currentIntegrator = integrator() as IntegratorName;
    simulationRuntime.setIntegrator(currentIntegrator);

    const rawDt = dt() * simSpeed();
    const maxDt = currentIntegrator === 'Euler' ? MAX_DT_EULER : MAX_DT_RK4;
    const simDt = Math.min(rawDt, maxDt);

    batch(() => {
      setBodies((prev) => {
        const next = simulationRuntime.tick(prev, simDt);
        return next.map((b: BodyState, i: number) => {
          const prevBody = prev[i]!;
          const nextBody = { ...prevBody, ...b } as RenderBody;

          if (nextBody.name.startsWith(SPACESHIP_NAME) && nextBody.hohmannDv2Applied === false) {
            const r = Math.sqrt(nextBody.x * nextBody.x + nextBody.y * nextBody.y);
            const direction = nextBody.hohmannDirection as 'out' | 'in';

            const radialVel = (nextBody.x * nextBody.vx + nextBody.y * nextBody.vy) / r;
            const prevRadialVel = nextBody.hohmannPrevRadialVel ?? radialVel;
            nextBody.hohmannPrevRadialVel = radialVel;

            let triggered = false;
            if (direction === 'out' && prevRadialVel > 0 && radialVel <= 0) {
              triggered = true;
            } else if (direction === 'in' && prevRadialVel < 0 && radialVel >= 0) {
              triggered = true;
            }

            if (triggered) {
              const vSpeed = Math.sqrt(nextBody.vx * nextBody.vx + nextBody.vy * nextBody.vy);
              if (vSpeed > 0) {
                const tx = nextBody.vx / vSpeed;
                const ty = nextBody.vy / vSpeed;
                const dv2 = nextBody.hohmannDv2Val as number;

                nextBody.vx += dv2 * tx;
                nextBody.vy += dv2 * ty;
                nextBody.hohmannDv2Applied = true;

                const dv2KmS = dv2 * 1731.48;
                addLogMessage(
                  `[INFO] Hohmann: Segundo impulso (Δv₂ = ${dv2KmS.toFixed(2)} km/s) aplicado. Órbita circularizada.`
                );
              }
            }
          }
          return nextBody;
        });
      });

      setCurrentDay((d) => d + simDt);
    });

    if (isComparing()) {
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
    let scale = camera.scale;

    const currentBodies = untrack(bodies);
    const ships = currentBodies.filter((b) => b.name.startsWith(SPACESHIP_NAME));

    if (followSpaceship() && ships.length > 0) {
      const ship = ships[ships.length - 1] as RenderBody;
      const speed = Math.sqrt(ship.vx * ship.vx + ship.vy * ship.vy);
      const targetScale = Math.max(35, Math.min(300, 1.8 / (speed + 0.005)));
      camera.scale += (targetScale - camera.scale) * 0.05;
      scale = camera.scale;

      const targetX = -ship.x * scale;
      const targetY = ship.y * scale;
      camera.offsetX += (targetX - camera.offsetX) * 0.05;
      camera.offsetY += (targetY - camera.offsetY) * 0.05;
    }

    const { cx, cy } = camera.getCenter();
    launcher?.updateTransform(scale, cx, cy);

    renderer.render(buildScene(currentBodies, dt(), currentDay()), showOrbit());

    if (isComparing()) {
      drawComparisonTrails(ctx, scale, cx, cy);
    }

    if (showLagrange()) {
      const sun = currentBodies.find((b) => b.name === 'Sun');
      const earth = currentBodies.find((b) => b.name === 'Earth');
      if (sun && earth) {
        const dx = earth.x - sun.x;
        const dy = earth.y - sun.y;
        const R = Math.sqrt(dx * dx + dy * dy);
        if (R > 0) {
          const ux = dx / R;
          const uy = dy / R;

          const alpha = earth.mass / (sun.mass + earth.mass);
          const rL = R * Math.pow(alpha / 3, 1 / 3);

          const x1 = earth.x - rL * ux;
          const y1 = earth.y - rL * uy;

          const x2 = earth.x + rL * ux;
          const y2 = earth.y + rL * uy;

          const x3 = sun.x - R * (1 - (5 / 12) * alpha) * ux;
          const y3 = sun.y - R * (1 - (5 / 12) * alpha) * uy;

          const cos60 = 0.5;
          const sin60 = 0.8660254;
          const x4 = sun.x + R * (ux * cos60 - uy * sin60);
          const y4 = sun.y + R * (ux * sin60 + uy * cos60);

          const x5 = sun.x + R * (ux * cos60 + uy * sin60);
          const y5 = sun.y + R * (-ux * sin60 + uy * cos60);

          const points = [
            { name: 'L1', x: x1, y: y1 },
            { name: 'L2', x: x2, y: y2 },
            { name: 'L3', x: x3, y: y3 },
            { name: 'L4', x: x4, y: y4 },
            { name: 'L5', x: x5, y: y5 },
          ];

          ctx.save();
          ctx.fillStyle = '#10b981';
          ctx.strokeStyle = '#10b981';
          ctx.font = 'bold 9px monospace';
          for (const p of points) {
            const px = cx + p.x * scale;
            const py = cy - p.y * scale;
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillText(p.name, px + 5, py - 4);
          }
          ctx.restore();
        }
      }
    }

    if (showHohmann()) {
      const params = hohmannParams();
      const originBody = currentBodies.find((b) => b.name === params.origin);
      const targetBody = currentBodies.find((b) => b.name === params.target);
      if (originBody && targetBody && originBody.name !== targetBody.name) {
        const r1 = Math.sqrt(originBody.x * originBody.x + originBody.y * originBody.y);
        const r2 = Math.sqrt(targetBody.x * targetBody.x + targetBody.y * targetBody.y);
        if (r1 > 0 && r2 > 0) {
          const a = (r1 + r2) / 2;
          const b = Math.sqrt(r1 * r2);
          const c = Math.abs(r1 - r2) / 2;
          const theta = Math.atan2(originBody.y, originBody.x);

          const ellipseCenterX = r1 < r2 ? -c * Math.cos(theta) : c * Math.cos(theta);
          const ellipseCenterY = r1 < r2 ? -c * Math.sin(theta) : c * Math.sin(theta);

          const ex = cx + ellipseCenterX * scale;
          const ey = cy - ellipseCenterY * scale;

          ctx.save();
          ctx.beginPath();
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 1.5;
          ctx.ellipse(ex, ey, a * scale, b * scale, -theta, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

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

    for (const ship of ships) {
      drawSpaceship(ctx, ship as RenderBody, scale, cx, cy, showTrajectory());
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

    const hoveredPlanet = getHoveredBody(mouseX, mouseY, untrack(bodies), scale, cx, cy);

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
        let launchedFrom: string | undefined;
        let addedVx = 0;
        let addedVy = 0;
        let launchX = spaceship.x;
        let launchY = spaceship.y;

        const currentBodies = bodies();

        for (const body of currentBodies) {
          const dx = spaceship.x - body.x;
          const dy = spaceship.y - body.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const baseRadius = body.radius ?? 5;
          const bodyRadiusAU = baseRadius / camera.scale;

          if (dist < bodyRadiusAU * 2) {
            launchedFrom = body.name;
            addedVx = body.vx;
            addedVy = body.vy;

            const safeDistance = bodyRadiusAU * 1.5;
            const vMag = Math.sqrt(spaceship.vx * spaceship.vx + spaceship.vy * spaceship.vy);
            if (vMag > 0) {
              launchX = body.x + (spaceship.vx / vMag) * safeDistance;
              launchY = body.y + (spaceship.vy / vMag) * safeDistance;
            }
            break;
          }
        }

        const uniqueName = `${SPACESHIP_NAME}-${Date.now()}`;

        const dragMultiplier = 2.5;

        const spaceshipRender: RenderBody = {
          ...spaceship,
          name: uniqueName,
          x: launchX,
          y: launchY,
          vx: spaceship.vx * dragMultiplier + addedVx,
          vy: spaceship.vy * dragMultiplier + addedVy,
          mass: 1e-25,
          radius: 4,
          color: '#00ffff',
          launchedFrom,
        };

        setBodies([...bodies(), spaceshipRender]);

        addLogMessage(
          `[INFO] Nave lanzada: pos = (${spaceshipRender.x.toFixed(3)}, ${spaceshipRender.y.toFixed(3)}) UA, vel drag = ${(spaceship.vx * dragMultiplier).toFixed(4)} UA/día.`
        );
      },
      onCancel: () => {},
      onImpact: (bodyName) => {
        addLogMessage(`[CRITICAL] Nave espacial destruida por colisión con ${bodyName}.`);
      },
    });

    (canvasRef as HTMLCanvasElement & { launcherInstance?: SpaceshipLauncher }).launcherInstance =
      launcher;

    canvasRef.addEventListener('wheel', handleWheel, { passive: false });
    canvasRef.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvasRef.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvasRef.addEventListener('touchend', handleTouchEnd);

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
      // Track visual options to trigger re-renders when paused
      bodies();
      isComparing();
      showLagrange();
      showHohmann();
      showOrbit();
      showTrajectory();
      followSpaceship();
      currentDay();

      if (!isRunning() && renderer) {
        renderScene();
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(containerRef);

    onCleanup(() => {
      if (canvasRef) {
        canvasRef.removeEventListener('wheel', handleWheel);
        canvasRef.removeEventListener('touchstart', handleTouchStart);
        canvasRef.removeEventListener('touchmove', handleTouchMove);
        canvasRef.removeEventListener('touchend', handleTouchEnd);
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

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      isTouchZooming = true;
      const t0 = e.touches[0]!;
      const t1 = e.touches[1]!;
      const dx = t0.clientX - t1.clientX;
      const dy = t0.clientY - t1.clientY;
      lastTouchDist = Math.sqrt(dx * dx + dy * dy);
      lastTouchX = (t0.clientX + t1.clientX) / 2;
      lastTouchY = (t0.clientY + t1.clientY) / 2;
      e.preventDefault();
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isTouchZooming && e.touches.length === 2 && renderer) {
      e.preventDefault();
      const t0 = e.touches[0]!;
      const t1 = e.touches[1]!;

      const dx = t0.clientX - t1.clientX;
      const dy = t0.clientY - t1.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const midX = (t0.clientX + t1.clientX) / 2;
      const midY = (t0.clientY + t1.clientY) / 2;

      const rect = canvasRef!.getBoundingClientRect();
      const localMidX = midX - rect.left;
      const localMidY = midY - rect.top;

      const camera = renderer.getCamera();

      if (lastTouchDist > 0 && dist > 0) {
        const zoomFactor = dist / lastTouchDist;
        const clampedZoom = Math.max(0.8, Math.min(1.25, zoomFactor));
        camera.zoom(clampedZoom, localMidX, localMidY);
      }

      const deltaX = midX - lastTouchX;
      const deltaY = midY - lastTouchY;
      camera.pan(deltaX, deltaY);

      lastTouchDist = dist;
      lastTouchX = midX;
      lastTouchY = midY;

      const { cx, cy } = camera.getCenter();
      launcher?.updateTransform(camera.scale, cx, cy);
      renderScene();
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (e.touches.length < 2) {
      isTouchZooming = false;
      lastTouchDist = 0;
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

  const handleCanvasKeyDown = (e: KeyboardEvent) => {
    if (!renderer) return;
    const camera = renderer.getCamera();
    switch (e.key) {
      case '+':
      case '=':
        camera.zoom(1.3, canvasWidth / 2, canvasHeight / 2);
        renderScene();
        break;
      case '-':
        camera.zoom(1 / 1.3, canvasWidth / 2, canvasHeight / 2);
        renderScene();
        break;
      case '0':
        camera.autoScale(MAX_ORBIT_AU);
        renderScene();
        break;
      case 'ArrowLeft':
        camera.pan(-30, 0);
        renderScene();
        break;
      case 'ArrowRight':
        camera.pan(30, 0);
        renderScene();
        break;
      case 'ArrowUp':
        camera.pan(0, -30);
        renderScene();
        break;
      case 'ArrowDown':
        camera.pan(0, 30);
        renderScene();
        break;
      case ' ':
        setIsRunning(!isRunning());
        e.preventDefault();
        break;
      default:
        return;
    }
    const { cx, cy } = camera.getCenter();
    launcher?.updateTransform(camera.scale, cx, cy);
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
        onKeyDown={handleCanvasKeyDown}
        role="img"
        aria-label={`Simulación orbital. ${bodies().length} cuerpos. Día ${currentDay().toFixed(0)}. ${isRunning() ? 'En ejecución' : 'Pausado'}.`}
        tabIndex={0}
        class="block h-full w-full touch-none"
      />

      <div class="absolute right-3 bottom-3 z-10 flex flex-col gap-1 rounded-lg border border-slate-800 bg-slate-950/80 p-1 shadow-lg backdrop-blur-md">
        <button
          onClick={() => handleZoomButton(1.3)}
          class="flex h-7 w-7 items-center justify-center rounded bg-slate-900 text-sm font-bold text-slate-200 transition-colors hover:bg-slate-800 hover:text-white"
          aria-label="Acercar zoom"
        >
          ＋
        </button>
        <button
          onClick={() => handleZoomButton(1 / 1.3)}
          class="flex h-7 w-7 items-center justify-center rounded bg-slate-900 text-sm font-bold text-slate-200 transition-colors hover:bg-slate-800 hover:text-white"
          aria-label="Alejar zoom"
        >
          －
        </button>
        <button
          onClick={handleResetZoom}
          class="flex h-7 w-7 items-center justify-center rounded bg-slate-900 text-sm font-bold text-slate-200 transition-colors hover:bg-slate-800 hover:text-white"
          aria-label="Restablecer zoom al estado inicial"
        >
          ⌖
        </button>
      </div>
    </div>
  );
}

export default SolarSystemCanvas;
