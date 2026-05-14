import { type Component } from 'solid-js';
import { SolarSystemCanvas } from './ui/solar-system-canvas';

export const OrbitalJS: Component = () => {
  return (
    <>
      <h1 class="to-blue-900 text-2xl font-bold">Hello World</h1>

      <SolarSystemCanvas />
    </>
  );
};
