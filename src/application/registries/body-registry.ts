import type { CelestialBody } from "@/shared/types";

export class BodyRegistry {
  private readonly store = new Map<string, CelestialBody>();

  register(body: CelestialBody): void {
    this.store.set(body.id, body);
  }

  get(id: string): CelestialBody | undefined {
    return this.store.get(id);
  }

  list(): CelestialBody[] {
    return Array.from(this.store.values());
  }
}

export const bodyRegistry = new BodyRegistry();
