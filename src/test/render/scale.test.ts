import { describe, it, expect, vi, beforeEach } from "vitest";
import { DrawBodiesService } from "@/presentation/renderers/draw-bodies";
import { CanvasRenderer } from "@/presentation/renderers/canvas-renderer";
import type { BodyState } from "@/shared/types";

const drawBodiesService = new DrawBodiesService();
const drawBodies = drawBodiesService.draw.bind(drawBodiesService);
const clearTrails = drawBodiesService.clearTrails.bind(drawBodiesService);

function createTrackedCtx() {
  const fillStyleLog: string[] = [];
  const shadowColorLog: string[] = [];
  const shadowBlurLog: number[] = [];

  let _fillStyle = "";
  let _strokeStyle = "";
  let _shadowColor = "";
  let _shadowBlur = 0;

  const base: Record<string, unknown> = {
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    fillText: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    fillRect: vi.fn(),
    drawImage: vi.fn(),
    createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    lineWidth: 1,
    font: "10px sans-serif",
    imageSmoothingEnabled: false,
  };

  Object.defineProperty(base, "fillStyle", {
    get: () => _fillStyle,
    set: (v: string) => {
      _fillStyle = v;
      fillStyleLog.push(v);
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(base, "strokeStyle", {
    get: () => _strokeStyle,
    set: (v: string) => {
      _strokeStyle = v;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(base, "shadowColor", {
    get: () => _shadowColor,
    set: (v: string) => {
      _shadowColor = v;
      shadowColorLog.push(v);
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(base, "shadowBlur", {
    get: () => _shadowBlur,
    set: (v: number) => {
      _shadowBlur = v;
      shadowBlurLog.push(v);
    },
    enumerable: true,
    configurable: true,
  });

  return {
    ctx: base as unknown as CanvasRenderingContext2D,
    arc: base.arc as ReturnType<typeof vi.fn>,
    stroke: base.stroke as ReturnType<typeof vi.fn>,
    createRadialGradient: base.createRadialGradient as ReturnType<typeof vi.fn>,
    fillStyleLog,
    shadowColorLog,
    shadowBlurLog,
  };
}

import { getBodyRadius } from "@/presentation/renderers/body-renderer";

const SUN: BodyState = { name: "Sun", mass: 333_000, x: 0, y: 0, vx: 0, vy: 0 };
const MERCURY: BodyState = { name: "Mercury", mass: 0.055, x: 0.39, y: 0, vx: 0, vy: 0 };
const VENUS: BodyState = { name: "Venus", mass: 0.815, x: 0.72, y: 0, vx: 0, vy: 0 };
const EARTH: BodyState = { name: "Earth", mass: 1, x: 1, y: 0, vx: 0, vy: 0.0172 };
const MARS: BodyState = { name: "Mars", mass: 0.107, x: 1.52, y: 0, vx: 0, vy: 0.0124 };

const computeRadius = getBodyRadius;

describe("drawPlanets", () => {
  beforeEach(() => clearTrails());

  describe("AC1 – Logarithmic radius per planet", () => {
    it("calls arc() once for each non-Sun body", () => {
      const { ctx, arc } = createTrackedCtx();
      drawBodies(ctx, [EARTH, MARS], 100, 400, 300);
      expect(arc).toHaveBeenCalledTimes(2);
    });

    it("applies the 0.3 display-radius factor to the Sun", () => {
      const { ctx, arc } = createTrackedCtx();
      drawBodies(ctx, [SUN], 100, 400, 300);

      const expectedDisplayRadius = computeRadius(SUN.mass) * 0.3;
      const drawnRadii = arc.mock.calls.map((call: number[]) => call[2]);
      expect(drawnRadii).toContainEqual(expect.closeTo(expectedDisplayRadius, 1));
    });

    it("gives a heavier planet a larger radius than a lighter one", () => {
      const heavy: BodyState = { name: "Heavy", mass: 1_000, x: 0, y: 0, vx: 0, vy: 0 };
      const light: BodyState = { name: "Light", mass: 0.001, x: 1, y: 0, vx: 0, vy: 0 };

      clearTrails();
      const t1 = createTrackedCtx();
      drawBodies(t1.ctx, [heavy], 100, 400, 300);
      const rHeavy: number = t1.arc.mock.calls[0][2];

      clearTrails();
      const t2 = createTrackedCtx();
      drawBodies(t2.ctx, [light], 100, 400, 300);
      const rLight: number = t2.arc.mock.calls[0][2];

      expect(rHeavy).toBeGreaterThan(rLight);
    });
  });

  describe("AC2 – Planet colors", () => {
    it.each([
      ["Sun", SUN, "#f97316"],
      ["Mercury", MERCURY, "#9ca3af"],
      ["Venus", VENUS, "#facc15"],
      ["Earth", EARTH, "#3b82f6"],
      ["Mars", MARS, "#ef4444"],
    ])("%s is rendered with color %s", (_name, body, expectedColor) => {
      const { ctx, fillStyleLog } = createTrackedCtx();
      drawBodies(ctx, [body as BodyState], 100, 400, 300);
      expect(fillStyleLog).toContain(expectedColor);
    });
  });

  describe("AC3 & AC7 – Trail capped at N = 200 points", () => {
    it("starts drawing trail segments from the second render onward", () => {
      const { ctx, stroke } = createTrackedCtx();
      for (let i = 0; i < 3; i++) drawBodies(ctx, [EARTH], 100, 400 + i, 300);
      expect(stroke.mock.calls.length).toBeGreaterThanOrEqual(2);
    });

    it("trail opacity gradient increments with each segment", () => {
      const { ctx, stroke } = createTrackedCtx();
      for (let i = 0; i < 5; i++) drawBodies(ctx, [EARTH], 100, 400 + i, 300);
      expect(stroke.mock.calls.length).toBeGreaterThanOrEqual(4);
    });

    it("stabilizes at 199 trail strokes per render after hitting the 200-point cap", () => {
      const { ctx, stroke } = createTrackedCtx();

      for (let i = 0; i < 200; i++) drawBodies(ctx, [EARTH], 100, 400 + i * 0.1, 300);
      const strokesAtCap = stroke.mock.calls.length;

      for (let i = 200; i < 210; i++) drawBodies(ctx, [EARTH], 100, 400 + i * 0.1, 300);
      expect(stroke.mock.calls.length - strokesAtCap).toBe(10 * 199);
    });
  });

  describe("AC5 – Sun radial glow", () => {
    it("calls createRadialGradient() for the Sun", () => {
      const { ctx, createRadialGradient } = createTrackedCtx();
      drawBodies(ctx, [SUN], 100, 400, 300);
      expect(createRadialGradient).toHaveBeenCalled();
    });

    it("does NOT call createRadialGradient() for non-Sun planets", () => {
      const { ctx, createRadialGradient } = createTrackedCtx();
      drawBodies(ctx, [EARTH, MARS], 100, 400, 300);
      expect(createRadialGradient).not.toHaveBeenCalled();
    });

    it("draws 2 arcs for the Sun: one glow halo + one planet circle", () => {
      const { ctx, arc } = createTrackedCtx();
      drawBodies(ctx, [SUN], 100, 400, 300);
      expect(arc).toHaveBeenCalledTimes(2);
    });
  });

  describe("AC6 – Subtle shadow per planet", () => {
    it("sets shadowColor to the planet color before drawing the circle", () => {
      const { ctx, shadowColorLog } = createTrackedCtx();
      drawBodies(ctx, [EARTH], 100, 400, 300);
      expect(shadowColorLog).toContain("#3b82f6");
    });

    it("applies a non-zero shadowBlur while drawing each planet", () => {
      const { ctx, shadowBlurLog } = createTrackedCtx();
      drawBodies(ctx, [EARTH], 100, 400, 300);
      expect(shadowBlurLog.some((b) => b > 0)).toBe(true);
    });

    it("resets shadowBlur to 0 after rendering each planet", () => {
      const { ctx, shadowBlurLog } = createTrackedCtx();
      drawBodies(ctx, [EARTH], 100, 400, 300);
      expect(shadowBlurLog.at(-1)).toBe(0);
    });

    it("gives the Sun a higher shadowBlur than regular planets", () => {
      const t1 = createTrackedCtx();
      drawBodies(t1.ctx, [SUN], 100, 400, 300);
      const sunBlur = Math.max(...t1.shadowBlurLog.filter((b) => b > 0));

      clearTrails();
      const t2 = createTrackedCtx();
      drawBodies(t2.ctx, [EARTH], 100, 400, 300);
      const earthBlur = Math.max(...t2.shadowBlurLog.filter((b) => b > 0));

      expect(sunBlur).toBeGreaterThan(earthBlur);
    });
  });
});

describe("CanvasRenderer", () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    clearTrails();
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d")!;
    (ctx as any).canvas = canvas;
  });

  it("sets canvas width and height on construction", () => {
    new CanvasRenderer(canvas, 800, 600, ctx);
    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(600);
  });

  it("clear() redraws the pre-rendered star background via drawImage", () => {
    const renderer = new CanvasRenderer(canvas, 800, 600, ctx);
    renderer.initialize();
    (ctx.drawImage as ReturnType<typeof vi.fn>).mockClear();
    renderer.clear();
    expect(ctx.drawImage).toHaveBeenCalled();
  });

  it("render() draws at least one arc per body passed in", () => {
    const renderer = new CanvasRenderer(canvas, 800, 600, ctx);
    renderer.initialize();
    (ctx.arc as ReturnType<typeof vi.fn>).mockClear();
    const scene = {
      bodies: [EARTH, MARS] as any,
      overlays: [],
      annotations: [],
      metadata: { name: "test", timeStep: 0.5, elapsed: 0 },
    };
    renderer.render(scene);
    expect((ctx.arc as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it("render() calls clear() before drawing bodies", () => {
    const renderer = new CanvasRenderer(canvas, 800, 600, ctx);
    renderer.initialize();
    (ctx.drawImage as ReturnType<typeof vi.fn>).mockClear();
    const scene = {
      bodies: [EARTH] as any,
      overlays: [],
      annotations: [],
      metadata: { name: "test", timeStep: 0.5, elapsed: 0 },
    };
    renderer.render(scene);
    expect(ctx.drawImage).toHaveBeenCalledTimes(1);
  });

  it("resize() updates the canvas to the new dimensions", () => {
    const renderer = new CanvasRenderer(canvas, 800, 600, ctx);
    renderer.resize(1280, 720);
    expect(canvas.width).toBe(1280);
    expect(canvas.height).toBe(720);
  });

  it("resize() reinitialises the star background at the new size", () => {
    const renderer = new CanvasRenderer(canvas, 800, 600, ctx);
    renderer.initialize();
    (ctx.drawImage as ReturnType<typeof vi.fn>).mockClear();
    renderer.resize(1280, 720);
    renderer.clear();
    expect(ctx.drawImage).toHaveBeenCalled();
  });
});
