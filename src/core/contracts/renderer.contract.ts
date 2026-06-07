import type { Scene } from "@/shared/types/scene";

export interface Renderer {
  initialize(): void;
  render(scene: Scene): void;
  resize(width: number, height: number): void;
  destroy(): void;
}
