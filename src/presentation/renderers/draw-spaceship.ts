/**
 * draw-spaceship.ts
 *
 * Renderizado de la nave espacial en Canvas 2D.
 * Consistente con el estilo de draw-planets.ts:
 *   - Trail degradado (mismo mecanismo, color cian/blanco)
 *   - Triángulo orientado hacia el vector velocidad
 *   - Flecha de velocidad durante el aiming
 *   - Mensaje "Impacto" al colisionar
 */

import type { BodyState, TrailPoint } from "@/shared/types";
import { addTrailPoint } from "./body-renderer";
import {
  SPACESHIP_NAME,
  SPACESHIP_TRAIL_LENGTH,
  SPACESHIP_LAUNCH_SPEED_FACTOR,
} from "@/shared/types/spaceship";

// ---------------------------------------------------------------------------
// Trail interno (misma estrategia que draw-planets.ts)
// ---------------------------------------------------------------------------

let spaceshipTrail: TrailPoint[] = [];

export function clearSpaceshipTrail(): void {
  spaceshipTrail = [];
}

// ---------------------------------------------------------------------------
// Nave en vuelo
// ---------------------------------------------------------------------------

/**
 * Dibuja la nave en vuelo: trail cian + triángulo orientado a la velocidad.
 * Llamar en cada frame del animation loop después de drawPlanets().
 *
 * @param ctx    - Contexto 2D del canvas
 * @param body   - BodyState de la nave (del array RK4)
 * @param scale  - Escala canvas en px/AU
 * @param cx     - Centro X del canvas en px
 * @param cy     - Centro Y del canvas en px
 */
export function drawSpaceship(
  ctx: CanvasRenderingContext2D,
  body: BodyState,
  scale: number,
  cx: number,
  cy: number,
): void {
  const px = cx + body.x * scale;
  const py = cy - body.y * scale; // invertir Y: simulación Y↑, canvas Y↓

  // Actualizar trail
  spaceshipTrail = addTrailPoint(spaceshipTrail, { x: px, y: py }, SPACESHIP_TRAIL_LENGTH);

  // Trail degradado cian → blanco
  for (let i = 1; i < spaceshipTrail.length; i++) {
    const opacity = i / spaceshipTrail.length;
    const prev = spaceshipTrail[i - 1]!;
    const curr = spaceshipTrail[i]!;

    // Degradado de cian a blanco según posición en el trail
    const r = Math.floor(opacity * 255);
    const g = 255;
    const b = 255;
    const a = Math.floor(opacity * 200)
      .toString(16)
      .padStart(2, "0");

    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(curr.x, curr.y);
    ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    void a; // evitar unused var (el canal alpha va en rgba)
  }

  // Ángulo de orientación según velocidad
  // vx en AU/día → dirección en canvas (Y invertida)
  const angle = Math.atan2(-body.vy, body.vx);

  drawShapeTriangle(ctx, px, py, angle, "#00ffff");
}

// ---------------------------------------------------------------------------
// Vector velocidad durante aiming
// ---------------------------------------------------------------------------

/**
 * Dibuja la línea + flecha de velocidad mientras el usuario arrastra.
 * Se llama solo durante la fase "aiming".
 *
 * @param ctx      - Contexto 2D del canvas
 * @param origin   - Punto de origen en canvas px
 * @param current  - Posición actual del mouse en canvas px
 */
export function drawVelocityArrow(
  ctx: CanvasRenderingContext2D,
  origin: { x: number; y: number },
  current: { x: number; y: number },
  scale: number,
): void {
  const dx = current.x - origin.x;
  const dy = current.y - origin.y;
  const angle = Math.atan2(dy, dx);
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length < 2) return; // sin drag mínimo, no dibujar

  // Línea punteada
  ctx.save();
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = "rgba(0, 255, 255, 0.7)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(current.x, current.y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Punta de flecha
  const headLength = 12;
  ctx.fillStyle = "rgba(0, 255, 255, 0.9)";
  ctx.beginPath();
  ctx.moveTo(current.x, current.y);
  ctx.lineTo(
    current.x - headLength * Math.cos(angle - Math.PI / 6),
    current.y - headLength * Math.sin(angle - Math.PI / 6),
  );
  ctx.lineTo(
    current.x - headLength * Math.cos(angle + Math.PI / 6),
    current.y - headLength * Math.sin(angle + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fill();

  // Preview del triángulo en el origen
  drawShapeTriangle(ctx, origin.x, origin.y, angle, "rgba(0,255,255,0.5)");

  // Etiqueta de velocidad estimada basada en la escala de la cámara
  const speed = (length / scale) * SPACESHIP_LAUNCH_SPEED_FACTOR;
  ctx.fillStyle = "rgba(0,255,255,0.8)";
  ctx.font = "11px monospace";
  ctx.fillText(`v ≈ ${speed.toFixed(4)} AU/día`, current.x + 10, current.y - 10);

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Mensaje de impacto
// ---------------------------------------------------------------------------

/**
 * Dibuja el mensaje "Impacto" centrado en la posición de colisión.
 * Llamar durante los frames post-colisión con un alpha decreciente.
 *
 * @param ctx    - Contexto 2D del canvas
 * @param px     - Posición X de la colisión en canvas px
 * @param py     - Posición Y de la colisión en canvas px
 * @param alpha  - Opacidad del mensaje (1 → 0 durante el fade)
 */
export function drawImpactMessage(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  alpha: number,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;

  // Fondo semitransparente
  ctx.fillStyle = "rgba(255, 60, 60, 0.85)";
  ctx.beginPath();
  ctx.roundRect(px - 52, py - 22, 104, 36, 6);
  ctx.fill();

  // Texto
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 15px monospace";
  ctx.textAlign = "center";
  ctx.fillText("💥 Impacto", px, py);

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Helper: triángulo orientado
// ---------------------------------------------------------------------------

/**
 * Dibuja un triángulo apuntando en la dirección `angle`.
 * Tamaño fijo de 10px de largo, consistente con la escala del canvas.
 */
function drawShapeTriangle(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  angle: number,
  color: string,
): void {
  const size = 10;

  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(angle);

  ctx.beginPath();
  ctx.moveTo(size, 0); // punta delantera
  ctx.lineTo(-size * 0.6, size * 0.5); // ala izquierda
  ctx.lineTo(-size * 0.3, 0); // entalla central
  ctx.lineTo(-size * 0.6, -size * 0.5); // ala derecha
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

// Re-exportar nombre para que el animation loop pueda filtrar la nave del array
export { SPACESHIP_NAME };
