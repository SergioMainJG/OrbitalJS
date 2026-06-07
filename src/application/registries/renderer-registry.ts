import type { Renderer } from "@/core/contracts/renderer.contract";

export class RendererRegistry {
  private readonly store = new Map<string, Renderer>();

  register(id: string, renderer: Renderer): void {
    this.store.set(id, renderer);
  }

  get(id: string): Renderer | undefined {
    return this.store.get(id);
  }

  listIds(): string[] {
    return Array.from(this.store.keys());
  }
}

export const rendererRegistry = new RendererRegistry();
