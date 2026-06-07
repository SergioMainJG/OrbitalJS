import type { RenderBody } from "./render-body.interface";

export interface SceneMetadata {
  name: string;
  epoch?: string;
  timeStep: number;
  elapsed: number;
}

export interface Annotation {
  bodyId: string;
  label: string;
  visible: boolean;
}

export interface Overlay {
  id: string;
  type: "trail" | "orbit" | "vector" | "comparison";
  data: unknown;
}

export interface Scene {
  bodies: RenderBody[];
  overlays: Overlay[];
  annotations: Annotation[];
  metadata: SceneMetadata;
}
