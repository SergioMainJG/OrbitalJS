import type { SimulationScenario } from "@/core/contracts/scenario.contract";

export interface ScenarioRepository {
  get(id: string): SimulationScenario | undefined;
  list(): SimulationScenario[];
  save(scenario: SimulationScenario): void;
}

export class InMemoryScenarioRepository implements ScenarioRepository {
  private readonly store = new Map<string, SimulationScenario>();

  get(id: string): SimulationScenario | undefined {
    return this.store.get(id);
  }

  list(): SimulationScenario[] {
    return Array.from(this.store.values());
  }

  save(scenario: SimulationScenario): void {
    this.store.set(scenario.id, scenario);
  }
}
