/**
 * spaceship-launcher.ts
 *
 * Maneja los eventos de mouse sobre el canvas para el lanzador de naves.
 * Implementa la máquina de estados: idle → aiming → launched.
 *
 * Criterios del ticket #9:
 *   ✓ mousedown  → fijar posición inicial
 *   ✓ mousemove  → dibujar vector velocidad (línea con flecha)
 *   ✓ mouseup    → crear BodyState e integrarlo con RK4
 *   ✓ Escape / clic derecho → cancelar lanzamiento
 *   ✓ Cursor crosshair en modo lanzamiento
 *   ✓ Detección de impacto (distancia < radio del cuerpo)
 */

import type { BodyState } from "@/types";
import {
  type LaunchState,
  SPACESHIP_NAME,
  canvasToAU,
  createSpaceshipBody,
  dragToVelocity,
  SPACESHIP_COLLISION_RADIUS_AU,
} from "@/types/spaceship";
import { drawVelocityArrow, drawImpactMessage, clearSpaceshipTrail } from "@/render/draw-spaceship";

// ---------------------------------------------------------------------------
// Tipos de callbacks
// ---------------------------------------------------------------------------

/** Llamado cuando el usuario lanza la nave — entrega el BodyState listo para RK4 */
type OnLaunchCallback = (spaceship: BodyState) => void;

/** Llamado cuando se cancela el lanzamiento (Escape / clic derecho) */
type OnCancelCallback = () => void;

/** Llamado cuando la nave impacta un cuerpo — entrega el nombre del cuerpo */
type OnImpactCallback = (bodyName: string) => void;

// ---------------------------------------------------------------------------
// Estado interno del impacto (fade out del mensaje)
// ---------------------------------------------------------------------------

interface ImpactFade {
  px: number;
  py: number;
  alpha: number;
}

// ---------------------------------------------------------------------------
// Clase principal
// ---------------------------------------------------------------------------

export class SpaceshipLauncher {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scale: number;
  private cx: number;
  private cy: number;

  private launchState: LaunchState = {
    phase: "idle",
    originCanvas: null,
    currentCanvas: null,
  };

  private impactFade: ImpactFade | null = null;

  private onLaunch: OnLaunchCallback;
  private onCancel: OnCancelCallback;
  private onImpact: OnImpactCallback;

  // Handlers guardados para poder removerlos en destroy()
  private readonly handleMouseDown: (e: MouseEvent) => void;
  private readonly handleMouseMove: (e: MouseEvent) => void;
  private readonly handleMouseUp: (e: MouseEvent) => void;
  private readonly handleKeyDown: (e: KeyboardEvent) => void;
  private readonly handleContextMenu: (e: MouseEvent) => void;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    scale: number,
    cx: number,
    cy: number,
    callbacks: {
      onLaunch: OnLaunchCallback;
      onCancel: OnCancelCallback;
      onImpact: OnImpactCallback;
    },
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.scale = scale;
    this.cx = cx;
    this.cy = cy;
    this.onLaunch = callbacks.onLaunch;
    this.onCancel = callbacks.onCancel;
    this.onImpact = callbacks.onImpact;

    // Bind de handlers para poder removerlos
    this.handleMouseDown = this.onMouseDown.bind(this);
    this.handleMouseMove = this.onMouseMove.bind(this);
    this.handleMouseUp = this.onMouseUp.bind(this);
    this.handleKeyDown = this.onKeyDown.bind(this);
    this.handleContextMenu = this.onContextMenu.bind(this);

    this.attachEvents();
    this.setCursor("crosshair");
  }

  // ---------------------------------------------------------------------------
  // API pública
  // ---------------------------------------------------------------------------

  /**
   * Actualiza la escala y centro cuando el canvas hace resize.
   */
  updateTransform(scale: number, cx: number, cy: number): void {
    this.scale = scale;
    this.cx = cx;
    this.cy = cy;
  }

  /**
   * Llamar en cada frame del animation loop.
   * Dibuja el vector velocidad (aiming) o el fade de impacto.
   */
  drawOverlay(): void {
    // Fase aiming: dibujar flecha de velocidad
    if (
      this.launchState.phase === "aiming" &&
      this.launchState.originCanvas !== null &&
      this.launchState.currentCanvas !== null
    ) {
      drawVelocityArrow(this.ctx, this.launchState.originCanvas, this.launchState.currentCanvas);
    }

    // Fade de impacto
    if (this.impactFade !== null) {
      drawImpactMessage(this.ctx, this.impactFade.px, this.impactFade.py, this.impactFade.alpha);
      this.impactFade.alpha -= 0.02; // fade en ~50 frames
      if (this.impactFade.alpha <= 0) {
        this.impactFade = null;
      }
    }
  }

  /**
   * Verificar colisión de la nave con todos los cuerpos en cada frame.
   * Llamar después de rk4Step con el estado actualizado.
   *
   * @param bodies  - Array de BodyState actualizado por RK4 (incluye la nave)
   * @returns       - Array sin la nave si hubo impacto, el mismo array si no
   */
  checkCollisions(bodies: BodyState[]): BodyState[] {
    const spaceship = bodies.find((b) => b.name === SPACESHIP_NAME);
    if (!spaceship) return bodies;

    for (const body of bodies) {
      if (body.name === SPACESHIP_NAME) continue;

      const dx = spaceship.x - body.x;
      const dy = spaceship.y - body.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Radio del cuerpo en AU (aproximado por masa — mismo criterio que getPlanetRadius)
      const bodyRadiusAU = SPACESHIP_COLLISION_RADIUS_AU + body.mass * 1e-26;

      if (dist < bodyRadiusAU) {
        // Colisión detectada
        const impactPx = {
          px: this.cx + spaceship.x * this.scale,
          py: this.cy - spaceship.y * this.scale,
        };

        this.impactFade = { ...impactPx, alpha: 1 };
        this.launchState = { phase: "idle", originCanvas: null, currentCanvas: null };
        clearSpaceshipTrail();

        this.onImpact(body.name);

        // Retornar array sin la nave
        return bodies.filter((b) => b.name !== SPACESHIP_NAME);
      }
    }

    return bodies;
  }

  /**
   * Cancela el lanzamiento en curso y vuelve a idle.
   */
  cancel(): void {
    this.launchState = { phase: "idle", originCanvas: null, currentCanvas: null };
    clearSpaceshipTrail();
    this.onCancel();
  }

  /**
   * Elimina todos los event listeners. Llamar al desmontar el componente SolidJS.
   */
  destroy(): void {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    document.removeEventListener("keydown", this.handleKeyDown);
    this.canvas.removeEventListener("contextmenu", this.handleContextMenu);
    this.setCursor("default");
  }

  // ---------------------------------------------------------------------------
  // Handlers de eventos
  // ---------------------------------------------------------------------------

  private onMouseDown(e: MouseEvent): void {
    // Solo botón izquierdo
    if (e.button !== 0) return;
    // No iniciar si ya hay una nave en vuelo
    if (this.launchState.phase === "launched") return;

    const pos = this.getCanvasPos(e);
    this.launchState = {
      phase: "aiming",
      originCanvas: pos,
      currentCanvas: pos,
    };
  }

  private onMouseMove(e: MouseEvent): void {
    if (this.launchState.phase !== "aiming") return;
    this.launchState = {
      ...this.launchState,
      currentCanvas: this.getCanvasPos(e),
    };
  }

  private onMouseUp(e: MouseEvent): void {
    if (e.button !== 0) return;
    if (this.launchState.phase !== "aiming") return;
    if (this.launchState.originCanvas === null || this.launchState.currentCanvas === null) return;

    const origin = this.launchState.originCanvas;
    const current = this.launchState.currentCanvas;

    const dx = current.x - origin.x;
    const dy = current.y - origin.y;
    const dragLength = Math.sqrt(dx * dx + dy * dy);

    // Ignorar clicks sin drag mínimo de 5px
    if (dragLength < 5) {
      this.cancel();
      return;
    }

    // Convertir origen a AU
    const posAU = canvasToAU(origin, this.cx, this.cy, this.scale);

    // Convertir drag a velocidad en AU/día
    const velAUDay = dragToVelocity({ dx, dy }, this.scale);

    // Crear BodyState
    const spaceship = createSpaceshipBody(posAU, velAUDay);

    this.launchState = { phase: "launched", originCanvas: null, currentCanvas: null };
    this.onLaunch(spaceship);
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (e.key === "Escape" && this.launchState.phase === "aiming") {
      this.cancel();
    }
  }

  private onContextMenu(e: MouseEvent): void {
    e.preventDefault();
    if (this.launchState.phase === "aiming") {
      this.cancel();
    }
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private attachEvents(): void {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    document.addEventListener("keydown", this.handleKeyDown);
    this.canvas.addEventListener("contextmenu", this.handleContextMenu);
  }

  private setCursor(style: string): void {
    this.canvas.style.cursor = style;
  }

  private getCanvasPos(e: MouseEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }
}
