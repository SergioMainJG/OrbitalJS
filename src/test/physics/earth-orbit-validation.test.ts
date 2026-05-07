import { describe, it, expect } from "vitest";

describe(`earth-orbit-validation.test.ts, testing para earth-orbit-valiation.ts!`, () => {
  it(`Hola Mundo es Hola mundo!`, () => {
    console.warn("No olvides descomentar el codigo y borrar el describe que funciona por ahora");
    console.info("Recuerda que puedes modificar este archivo a tu conveniencia");
    expect("Hello World").toBe("Hello World");
  });
});
// /* eslint-disable */
// /* prettier-ignore */
// import { describe, it, expect } from 'vitest';
// import { rk4Step } from '@/physics/rk4-step';
// import type { BodyState } from '@/types';
// import planetsData from '@/data/planets.json';

// const G = (4 * Math.PI * Math.PI) / (365.25 * 365.25);

// describe('Validación órbita terrestre vs datos NASA', () => {
//   const vEarth = Math.sqrt(G / 1);

// const loadEarthInitialState = (): BodyState[] => {
//   const earth = planetsData.find(p => p.name === 'Tierra');
//   const sun = { name: 'Sol', x: 0, y: 0, vx: 0, vy: 0, mass: 1 };
//   return [sun, earth];
// };
//   const simulateOrbit = (initialState: BodyState[], days: number, dt: number): BodyState[] => {
//     let state = initialState.map((b) => ({ ...b }));
//     const steps = Math.round(days / dt);

//     for (let i = 0; i < steps; i++) {
//       state = rk4Step(state, dt);
//     }

//     return state;
//   };

//   describe('Carga de condición inicial', () => {
//     it('debe cargar planets.json con condición inicial de Tierra', () => {
//       const state = loadEarthInitialState();

//       expect(state.length).toBeGreaterThanOrEqual(2);
//       const earth = state.find((b) => b.name === 'Tierra');
//       expect(earth).toBeDefined();
//       expect(earth!.x).toBeCloseTo(1, 5);
//       expect(earth!.y).toBeCloseTo(0, 5);
//     });

//     it('la condición inicial de Tierra debe tener velocidad orbital correcta', () => {
//       const state = loadEarthInitialState();
//       const earth = state.find((b) => b.name === 'Tierra');

//       expect(Math.abs(earth!.vx)).toBeLessThan(1e-6);
//       expect(earth!.vy).toBeCloseTo(vEarth, 5);
//     });

//     it('el Sol debe estar en el origen con masa 1', () => {
//       const state = loadEarthInitialState();
//       const sun = state.find((b) => b.name === 'Sol');

//       expect(sun!.x).toBeCloseTo(0, 10);
//       expect(sun!.y).toBeCloseTo(0, 10);
//       expect(sun!.mass).toBeCloseTo(1, 10);
//     });
//   });

//   describe('Simulación 365 días con dt = 0.5 días', () => {
//     it('debe simular 365 días con dt = 0.5 días (730 pasos)', () => {
//       const initialState = loadEarthInitialState();
//       const dt = 0.5;
//       const days = 365;

//       const finalState = simulateOrbit(initialState, days, dt);

//       expect(finalState.length).toBe(initialState.length);
//       const earth = finalState.find((b) => b.name === 'Tierra');
//       expect(earth).toBeDefined();
//       expect(isNaN(earth!.x)).toBe(false);
//       expect(isNaN(earth!.y)).toBe(false);
//     });

//     it('posición final debe estar a < 0.05 UA de la posición inicial (elipse cerrada)', () => {
//       const initialState = loadEarthInitialState();
//       const dt = 0.5;
//       const days = 365;

//       const finalState = simulateOrbit(initialState, days, dt);

//       const earthInitial = initialState.find((b) => b.name === 'Tierra')!;
//       const earthFinal = finalState.find((b) => b.name === 'Tierra')!;

//       const closureError = Math.sqrt(
//         (earthFinal.x - earthInitial.x) ** 2 + (earthFinal.y - earthInitial.y) ** 2
//       );

//       expect(closureError).toBeLessThan(0.05);
//     });

//     it('la velocidad final debe ser similar a la velocidad inicial', () => {
//       const initialState = loadEarthInitialState();
//       const dt = 0.5;
//       const days = 365;

//       const finalState = simulateOrbit(initialState, days, dt);

//       const earthInitial = initialState.find((b) => b.name === 'Tierra')!;
//       const earthFinal = finalState.find((b) => b.name === 'Tierra')!;

//       const initialSpeed = Math.sqrt(earthInitial.vx ** 2 + earthInitial.vy ** 2);
//       const finalSpeed = Math.sqrt(earthFinal.vx ** 2 + earthFinal.vy ** 2);

//       expect(Math.abs(finalSpeed - initialSpeed)).toBeLessThan(0.001);
//     });
//   });

//   describe('Forma de la trayectoria (elipse con Sol en un foco)', () => {
//     it('la distancia al Sol debe variar (órbita elíptica, no circular perfecta)', () => {
//       const initialState = loadEarthInitialState();
//       let state = initialState.map((b) => ({ ...b }));
//       const dt = 0.5;
//       const steps = 730;
//       const distances: number[] = [];

//       for (let i = 0; i < steps; i++) {
//         state = rk4Step(state, dt);
//         const earth = state.find((b) => b.name === 'Tierra')!;
//         const sun = state.find((b) => b.name === 'Sol')!;
//         const dist = Math.sqrt((earth.x - sun.x) ** 2 + (earth.y - sun.y) ** 2);
//         distances.push(dist);
//       }

//       const minDist = Math.min(...distances);
//       const maxDist = Math.max(...distances);

//       expect(maxDist - minDist).toBeGreaterThan(0.001);
//     });

//     it('el Sol debe estar cerca de un foco de la elipse (no en el centro)', () => {
//       const initialState = loadEarthInitialState();
//       let state = initialState.map((b) => ({ ...b }));
//       const dt = 0.5;
//       const steps = 730;
//       const positions: { x: number; y: number }[] = [];

//       for (let i = 0; i < steps; i++) {
//         state = rk4Step(state, dt);
//         const earth = state.find((b) => b.name === 'Tierra')!;
//         positions.push({ x: earth.x, y: earth.y });
//       }

//       const avgX = positions.reduce((s, p) => s + p.x, 0) / positions.length;
//       const avgY = positions.reduce((s, p) => s + p.y, 0) / positions.length;
//       const centerX = (Math.min(...positions.map((p) => p.x)) + Math.max(...positions.map((p) => p.x))) / 2;
//       const centerY = (Math.min(...positions.map((p) => p.y)) + Math.max(...positions.map((p) => p.y))) / 2;

//       const centerToAvgDist = Math.sqrt((centerX - avgX) ** 2 + (centerY - avgY) ** 2);

//       expect(centerToAvgDist).toBeGreaterThan(0);
//     });

//     it('la trayectoria debe ser cerrada (primer y último punto cercanos)', () => {
//       const initialState = loadEarthInitialState();
//       let state = initialState.map((b) => ({ ...b }));
//       const dt = 0.5;
//       const steps = 730;
//       const positions: { x: number; y: number }[] = [];

//       const earth0 = initialState.find((b) => b.name === 'Tierra')!;
//       positions.push({ x: earth0.x, y: earth0.y });

//       for (let i = 0; i < steps; i++) {
//         state = rk4Step(state, dt);
//         const earth = state.find((b) => b.name === 'Tierra')!;
//         positions.push({ x: earth.x, y: earth.y });
//       }

//       const first = positions[0];
//       const last = positions[positions.length - 1];
//       const closureDistance = Math.sqrt((first.x - last.x) ** 2 + (first.y - last.y) ** 2);

//       expect(closureDistance).toBeLessThan(0.05);
//     });

//     it('la trayectoria no debe colapsar ni escapar (distancia acotada)', () => {
//       const initialState = loadEarthInitialState();
//       let state = initialState.map((b) => ({ ...b }));
//       const dt = 0.5;
//       const steps = 730;

//       for (let i = 0; i < steps; i++) {
//         state = rk4Step(state, dt);
//         const earth = state.find((b) => b.name === 'Tierra')!;
//         const sun = state.find((b) => b.name === 'Sol')!;
//         const dist = Math.sqrt((earth.x - sun.x) ** 2 + (earth.y - sun.y) ** 2);

//         expect(dist).toBeGreaterThan(0.1);
//         expect(dist).toBeLessThan(2.0);
//       }
//     });
//   });

//   describe('Métrica de éxito: cierre de órbita', () => {
//     it('si la Tierra no vuelve cerca de su punto de partida tras 1 año, el integrador o datos están mal', () => {
//       const initialState = loadEarthInitialState();
//       const finalState = simulateOrbit(initialState, 365, 0.5);

//       const earthInitial = initialState.find((b) => b.name === 'Tierra')!;
//       const earthFinal = finalState.find((b) => b.name === 'Tierra')!;

//       const closureError = Math.sqrt(
//         (earthFinal.x - earthInitial.x) ** 2 + (earthFinal.y - earthInitial.y) ** 2
//       );

//       expect(closureError).toBeLessThan(0.05);
//     });

//     it('el error de cierre debe ser reportable como un valor numérico', () => {
//       const initialState = loadEarthInitialState();
//       const finalState = simulateOrbit(initialState, 365, 0.5);

//       const earthInitial = initialState.find((b) => b.name === 'Tierra')!;
//       const earthFinal = finalState.find((b) => b.name === 'Tierra')!;

//       const closureError = Math.sqrt(
//         (earthFinal.x - earthInitial.x) ** 2 + (earthFinal.y - earthInitial.y) ** 2
//       );

//       expect(typeof closureError).toBe('number');
//       expect(closureError).toBeGreaterThanOrEqual(0);
//     });
//   });
// });
