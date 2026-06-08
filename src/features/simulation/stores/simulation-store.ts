import { createSignal } from "solid-js";
import type { RenderBody } from "@/shared/types";
import { SOLAR_SYSTEM_SCENARIO } from "@/shared/scenarios/solar-system.scenario";

// BUG FIX: MAX_ORBIT_AU updated to 40 to accommodate Pluto (39.5 AU).
// The camera auto-scales based on this value, so the full solar system is visible.
export const MAX_ORBIT_AU = 40;

// Scenario bodies without rendering properties — these are injected by loadScenario use-case
const rawScenarioBodies = SOLAR_SYSTEM_SCENARIO.bodies;

export const EARTH_INITIAL_POS = {
  x: rawScenarioBodies.find((b) => b.name === "Earth")?.x ?? 1.0,
  y: rawScenarioBodies.find((b) => b.name === "Earth")?.y ?? 0.0,
};

// Initial bodies start as the raw scenario bodies; loadScenario() applies rendering properties
const [bodies, setBodies] = createSignal<RenderBody[]>([]);
const [currentDay, setCurrentDay] = createSignal(0);
const [simSpeed, setSimSpeed] = createSignal(1);
const [showOrbit, setShowOrbit] = createSignal(true);
const [showTrajectory, setShowTrajectory] = createSignal(true);
const [dt, setDt] = createSignal(0.5);
const [integrator, setIntegrator] = createSignal("RK4");
const [isRunning, setIsRunning] = createSignal(true);
const [simulatedTime, setSimulatedTime] = createSignal(365);
const [logMessages, setLogMessages] = createSignal<string[]>([
  "[INFO] Simulación iniciada",
  "[INFO] Integrador: RK4 | dt: 0.5 días",
  "[INFO] Sistema Solar Completo: Sol + 8 planetas + Plutón",
]);

export {
  bodies,
  setBodies,
  currentDay,
  setCurrentDay,
  simSpeed,
  setSimSpeed,
  showOrbit,
  setShowOrbit,
  showTrajectory,
  setShowTrajectory,
  dt,
  setDt,
  integrator,
  setIntegrator,
  isRunning,
  setIsRunning,
  simulatedTime,
  setSimulatedTime,
  logMessages,
  setLogMessages,
  rawScenarioBodies,
};
