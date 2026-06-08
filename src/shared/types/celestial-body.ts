import type { Vector3 } from "./vector3";

export enum BodyType {
  Star = "Star",
  Planet = "Planet",
  Moon = "Moon",
  Asteroid = "Asteroid",
  Comet = "Comet",
  Spacecraft = "Spacecraft",
  Custom = "Custom",
}

export interface CelestialBody {
  id: string;
  name: string;
  mass: number;
  radius: number;
  position: Vector3;
  velocity: Vector3;
  type: BodyType;
  color?: string;
}
