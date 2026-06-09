import type { BodyState, RenderBody } from "@/shared/types";
import {
  type LaunchState,
  SPACESHIP_NAME,
  canvasToAU,
  createSpaceshipBody,
  dragToVelocity,
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

/**
 * Handles mouse-driven spaceship launch gestures on the simulation canvas.
 *
 * Manages three lifecycle phases:
 * - `idle`    — waiting for the user to begin a drag.
 * - `aiming`  — user is dragging; a velocity arrow is drawn as visual feedback.
 * - `launched`— the ship has been handed off to the physics engine.
 *
 * Also runs per-frame collision detection for all active spacecraft,
 * triggering a visual impact animation and removing destroyed bodies.
 */
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

  /**
   * @param canvas    - The HTMLCanvasElement receiving mouse events.
   * @param ctx       - Its 2D rendering context (used for overlay drawing).
   * @param scale     - Initial camera scale in px/AU.
   * @param cx        - Initial canvas origin X in pixels.
   * @param cy        - Initial canvas origin Y in pixels.
   * @param callbacks - Object with `onLaunch`, `onCancel`, and `onImpact` callbacks.
   */
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

  /**
   * Syncs the camera transform so that the aiming arrow and collision test
   * remain accurate after a zoom or pan event.
   *
   * @param scale - New camera scale in px/AU.
   * @param cx    - New canvas origin X in pixels.
   * @param cy    - New canvas origin Y in pixels.
   */
  updateTransform(scale: number, cx: number, cy: number): void {
    this.scale = scale;
    this.cx = cx;
    this.cy = cy;
  }

  /**
   * Draws any active overlay on top of the scene.
   * Called once per animation frame after the scene has been rendered.
   *
   * Renders:
   * - The velocity aiming arrow while the user is dragging.
   * - The fading impact message after a collision.
   */
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

  /**
   * Tests every active spacecraft against every non-spacecraft body for collision.
   *
   * A spacecraft is considered destroyed when its distance to a body is less than
   * `body.radius / camera.scale` (its visual radius in AU). Bodies listed in
   * `spaceship.launchedFrom` are temporarily exempted until the ship has cleared
   * their gravitational influence.
   *
   * @param bodies - Full body array from the simulation store.
   * @returns A new body array with destroyed spacecraft removed.
   */
  checkCollisions(bodies: BodyState[]): BodyState[] {
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
          const baseRadius = (launcherBody as RenderBody).radius ?? 5;
          const bodyRadiusAU = baseRadius / this.scale;

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

        const baseRadius = (body as RenderBody).radius ?? 5;
        const bodyRadiusAU = baseRadius / this.scale;

        if (dist < bodyRadiusAU) {
          const impactPx = {
            px: this.cx + spaceship.x * this.scale,
            py: this.cy - spaceship.y * this.scale,
          };

          this.impactFade = { ...impactPx, alpha: 1 };
          this.onImpact(body.name);
          impactOccurred = true;
          destroyed = true;
          break;
        }
      }

      if (destroyed) {
        updatedBodies = updatedBodies.filter((b) => b.name !== spaceship.name);
        clearSpaceshipTrail(spaceship.name);
      }
    }

    if (impactOccurred) {
      this.launchState = { phase: "idle", originCanvas: null, currentCanvas: null };
    }

    return updatedBodies;
  }

  /**
   * Cancels the current launch gesture and invokes the `onCancel` callback.
   * Clears all spacecraft trails.
   */
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
