import type { BodyState, RenderBody } from "@/shared/types";
import {
  type LaunchState,
  SPACESHIP_NAME,
  canvasToAU,
  createSpaceshipBody,
  dragToVelocity,
  SPACESHIP_COLLISION_RADIUS_AU,
  BODY_COLLISION_RADII_AU,
} from "@/shared/types/spaceship";
import { drawVelocityArrow, drawImpactMessage, clearSpaceshipTrail } from "./draw-spaceship";

type OnLaunchCallback = (spaceship: BodyState) => void;
type OnCancelCallback = () => void;
type OnImpactCallback = (bodyName: string) => void;

interface ImpactFade {
  px: number;
  py: number;
  alpha: number;
}

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

    this.handleMouseDown = this.onMouseDown.bind(this);
    this.handleMouseMove = this.onMouseMove.bind(this);
    this.handleMouseUp = this.onMouseUp.bind(this);
    this.handleKeyDown = this.onKeyDown.bind(this);
    this.handleContextMenu = this.onContextMenu.bind(this);

    this.attachEvents();
    this.setCursor("crosshair");
  }

  updateTransform(scale: number, cx: number, cy: number): void {
    this.scale = scale;
    this.cx = cx;
    this.cy = cy;
  }

  drawOverlay(): void {
    if (
      this.launchState.phase === "aiming" &&
      this.launchState.originCanvas !== null &&
      this.launchState.currentCanvas !== null
    ) {
      drawVelocityArrow(
        this.ctx,
        this.launchState.originCanvas,
        this.launchState.currentCanvas,
        this.scale,
      );
    }

    if (this.impactFade !== null) {
      drawImpactMessage(this.ctx, this.impactFade.px, this.impactFade.py, this.impactFade.alpha);
      this.impactFade.alpha -= 0.02;
      if (this.impactFade.alpha <= 0) {
        this.impactFade = null;
      }
    }
  }

  checkCollisions(bodies: BodyState[]): BodyState[] {
    // Filtrar todas las naves en lugar de buscar solo una
    const spaceships = bodies.filter((b) => b.name.startsWith(SPACESHIP_NAME)) as RenderBody[];
    if (spaceships.length === 0) return bodies;

    let updatedBodies = [...bodies];
    let impactOccurred = false;

    for (const spaceship of spaceships) {
      if (spaceship.launchedFrom) {
        const launcherBody = updatedBodies.find((b) => b.name === spaceship.launchedFrom);
        if (launcherBody) {
          const dx = spaceship.x - launcherBody.x;
          const dy = spaceship.y - launcherBody.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const bodyRadiusAU =
            BODY_COLLISION_RADII_AU[launcherBody.name] ??
            SPACESHIP_COLLISION_RADIUS_AU + launcherBody.mass * 1e-26;

          if (dist > bodyRadiusAU * 1.5) {
            delete spaceship.launchedFrom;
          }
        }
      }

      let destroyed = false;
      for (const body of updatedBodies) {
        if (body.name.startsWith(SPACESHIP_NAME)) continue;
        if (spaceship.launchedFrom === body.name) continue;

        const dx = spaceship.x - body.x;
        const dy = spaceship.y - body.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const bodyRadiusAU =
          BODY_COLLISION_RADII_AU[body.name] ?? SPACESHIP_COLLISION_RADIUS_AU + body.mass * 1e-26;

        if (dist < bodyRadiusAU) {
          const impactPx = {
            px: this.cx + spaceship.x * this.scale,
            py: this.cy - spaceship.y * this.scale,
          };

          this.impactFade = { ...impactPx, alpha: 1 };
          this.onImpact(body.name);
          impactOccurred = true;
          destroyed = true;
          break; // Romper el ciclo de cuerpos y pasar a la siguiente nave
        }
      }

      if (destroyed) {
        // Extraemos solo la nave destruida del array universal
        updatedBodies = updatedBodies.filter((b) => b.name !== spaceship.name);
      }
    }

    if (impactOccurred) {
      this.launchState = { phase: "idle", originCanvas: null, currentCanvas: null };
    }

    return updatedBodies;
  }

  cancel(): void {
    this.launchState = { phase: "idle", originCanvas: null, currentCanvas: null };
    clearSpaceshipTrail();
    this.onCancel();
  }

  /**
   * Full reset — clears launch state, impact fade, and trail.
   * Called by the Reset button in SimulationControls so users can
   * launch a new spaceship without reloading the page.
   */
  reset(): void {
    this.launchState = { phase: "idle", originCanvas: null, currentCanvas: null };
    this.impactFade = null;
    clearSpaceshipTrail();
  }

  destroy(): void {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    document.removeEventListener("keydown", this.handleKeyDown);
    this.canvas.removeEventListener("contextmenu", this.handleContextMenu);
    this.setCursor("default");
  }

  private onMouseDown(e: MouseEvent): void {
    if (e.button !== 0) return;
    if (this.launchState.phase === "aiming") return;

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

    if (dragLength < 5) {
      this.cancel();
      return;
    }

    const posAU = canvasToAU(origin, this.cx, this.cy, this.scale);
    const velAUDay = dragToVelocity({ dx, dy }, this.scale, posAU);
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
