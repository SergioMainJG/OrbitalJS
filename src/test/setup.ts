// oxlint-disable-next-line import/no-unassigned-import
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@solidjs/testing-library";
import { afterEach, vi } from "vitest";

class FakeCanvasRenderingContext2D {
  fillRect = vi.fn();
  clearRect = vi.fn();
  getImageData = vi.fn(() => ({ data: new Uint8ClampedArray(0) }));
  putImageData = vi.fn();
  createImageData = vi.fn(() => ({ data: new Uint8ClampedArray(0) }));
  setTransform = vi.fn();
  drawImage = vi.fn();
  save = vi.fn();
  fillText = vi.fn();
  restore = vi.fn();
  beginPath = vi.fn();
  moveTo = vi.fn();
  lineTo = vi.fn();
  closePath = vi.fn();
  stroke = vi.fn();
  strokeRect = vi.fn();
  strokeText = vi.fn();
  arc = vi.fn();
  arcTo = vi.fn();
  clip = vi.fn();
  scale = vi.fn();
  rotate = vi.fn();
  translate = vi.fn();
  transform = vi.fn();
  rect = vi.fn();
  roundRect = vi.fn();
  fill = vi.fn();
  quadraticCurveTo = vi.fn();
  bezierCurveTo = vi.fn();
  createLinearGradient = vi.fn(() => ({ addColorStop: vi.fn() }));
  createRadialGradient = vi.fn(() => ({ addColorStop: vi.fn() }));
  createPattern = vi.fn();
  measureText = vi.fn(() => ({ width: 0 }));
  fillStyle = "";
  strokeStyle = "";
  lineWidth = 1;
  font = "10px sans-serif";
  imageSmoothingEnabled = false;
}

HTMLCanvasElement.prototype.getContext = function (contextId: string) {
  if (contextId === "2d") {
    return new FakeCanvasRenderingContext2D() as unknown as CanvasRenderingContext2D;
  }
  return null;
} as typeof HTMLCanvasElement.prototype.getContext;

HTMLCanvasElement.prototype.toDataURL = vi.fn(() => "data:image/png;base64,");

afterEach(() => {
  cleanup();
});
