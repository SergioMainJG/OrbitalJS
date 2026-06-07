import { createSignal } from "solid-js";
import { getPlanetColor, getPlanetRadius } from "@/presentation/renderers/planet-renderer";
import type { RenderBody } from "@/shared/types";
import { UNIVERSAL_CONSTS } from "@/shared/constants";

const { G } = UNIVERSAL_CONSTS;

const MAX_ORBIT_AU = 1.52;

const initialBodies: RenderBody[] = [
  {
    name: "Sun",
    x: 0,
    y: 0,
    radius: getPlanetRadius(1),
    color: getPlanetColor("Sun"),
    mass: 1,
    vx: 0,
    vy: 0,
  },
  {
    name: "Earth",
    x: 1.0,
    y: 0,
    radius: getPlanetRadius(3e-6),
    color: getPlanetColor("Earth"),
    mass: 3e-6,
    vx: 0,
    vy: Math.sqrt(G / 1.0),
  },
  {
    name: "Mars",
    x: 1.52,
    y: 0,
    radius: getPlanetRadius(3.2e-7),
    color: getPlanetColor("Mars"),
    mass: 3.2e-7,
    vx: 0,
    vy: Math.sqrt(G / 1.52),
  },
  {
    name: "Venus",
    x: 0.72,
    y: 0,
    radius: getPlanetRadius(2.4e-6),
    color: getPlanetColor("Venus"),
    mass: 2.4e-6,
    vx: 0,
    vy: Math.sqrt(G / 0.72),
  },
  {
    name: "Mercury",
    x: 0.387,
    y: 0,
    radius: getPlanetRadius(1.65e-7),
    color: getPlanetColor("Mercury"),
    mass: 1.65e-7,
    vx: 0,
    vy: Math.sqrt(G / 0.387),
  },
];

export const EARTH_INITIAL_POS = {
  x: initialBodies.find((b) => b.name === "Earth")?.x ?? 1.0,
  y: initialBodies.find((b) => b.name === "Earth")?.y ?? 0.0,
};

const [bodies, setBodies] = createSignal<RenderBody[]>(initialBodies);
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
  "[INFO] Validación con datos NASA: Tierra (JPL Horizons)",
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
  initialBodies,
  MAX_ORBIT_AU,
};
