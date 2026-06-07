import type { SimulationScenario } from "@/core/contracts/scenario.contract";

export class ScenarioRegistry {
  private readonly store = new Map<string, SimulationScenario>();

  register(scenario: SimulationScenario): void {
    this.store.set(scenario.id, scenario);
  }

  get(id: string): SimulationScenario | undefined {
    return this.store.get(id);
  }

  list(): SimulationScenario[] {
    return Array.from(this.store.values());
  }
}

export const scenarioRegistry = new ScenarioRegistry();
