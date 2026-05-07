import { describe, it, expect } from "vitest";

describe(`rk4-step.test.ts, testing para rk4-step.ts!`, () => {
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
// import { eulerStep } from '@/physics/euler-step';
// import type { BodyState } from '@/types';

// const G = (4 * Math.PI * Math.PI) / (365.25 * 365.25);

// describe('rk4Step - firma y tipo de retorno', () => {
//   it('debe aceptar (state: BodyState[], dt: number) y retornar BodyState[]', () => {
//     const state: BodyState[] = [
//       { name: 'test', x: 0, y: 0, vx: 1, vy: 0, mass: 1 },
//     ];

//     const result = rk4Step(state, 1);

//     expect(Array.isArray(result)).toBe(true);
//     expect(result.length).toBe(state.length);
//   });

//   it('debe retornar objetos con la estructura BodyState completa', () => {
//     const state: BodyState[] = [
//       { name: 'A', x: 1, y: 2, vx: 0.1, vy: 0.2, mass: 5 },
//     ];

//     const result = rk4Step(state, 0.5);

//     for (const body of result) {
//       expect(body).toHaveProperty('name');
//       expect(body).toHaveProperty('x');
//       expect(body).toHaveProperty('y');
//       expect(body).toHaveProperty('vx');
//       expect(body).toHaveProperty('vy');
//       expect(body).toHaveProperty('mass');
//       expect(typeof body.name).toBe('string');
//       expect(typeof body.x).toBe('number');
//       expect(typeof body.y).toBe('number');
//       expect(typeof body.vx).toBe('number');
//       expect(typeof body.vy).toBe('number');
//       expect(typeof body.mass).toBe('number');
//     }
//   });

//   it('debe preservar el nombre y la masa de cada cuerpo', () => {
//     const state: BodyState[] = [
//       { name: 'Sol', x: 0, y: 0, vx: 0, vy: 0, mass: 1 },
//       { name: 'Tierra', x: 1, y: 0, vx: 0, vy: 0.017202, mass: 3.003e-6 },
//     ];

//     const result = rk4Step(state, 1);

//     expect(result[0].name).toBe('Sol');
//     expect(result[0].mass).toBe(1);
//     expect(result[1].name).toBe('Tierra');
//     expect(result[1].mass).toBeCloseTo(3.003e-6, 10);
//   });
// });

// describe('rk4Step - cuerpo sin interacción gravitacional', () => {
//   it('un solo cuerpo debe moverse en línea recta (aceleración = 0)', () => {
//     const state: BodyState[] = [
//       { name: 'partícula', x: 0, y: 0, vx: 2, vy: 3, mass: 1 },
//     ];
//     const dt = 0.5;

//     const result = rk4Step(state, dt);

//     expect(result[0].x).toBeCloseTo(0 + 2 * dt, 10);
//     expect(result[0].y).toBeCloseTo(0 + 3 * dt, 10);
//     expect(result[0].vx).toBeCloseTo(2, 10);
//     expect(result[0].vy).toBeCloseTo(3, 10);
//   });

//   it('dos cuerpos sin masa deben moverse en línea recta sin aceleración', () => {
//     const state: BodyState[] = [
//       { name: 'A', x: 0, y: 0, vx: 1, vy: 0, mass: 0 },
//       { name: 'B', x: 1, y: 0, vx: 0, vy: 1, mass: 0 },
//     ];
//     const dt = 1;

//     const result = rk4Step(state, dt);

//     expect(result[0].x).toBeCloseTo(1, 10);
//     expect(result[0].vy).toBeCloseTo(0, 10);
//     expect(result[1].y).toBeCloseTo(1, 10);
//     expect(result[1].vx).toBeCloseTo(0, 10);
//   });
// });

// describe('rk4Step - evaluación de k1, k2, k3, k4', () => {
//   it('debe producir un resultado diferente a un paso Euler simple (usa 4 evaluaciones)', () => {
//     const vEarth = Math.sqrt(G / 1);
//     const state: BodyState[] = [
//       { name: 'Sol', x: 0, y: 0, vx: 0, vy: 0, mass: 1 },
//       { name: 'Tierra', x: 1, y: 0, vx: 0, vy: vEarth, mass: 3.003e-6 },
//     ];
//     const dt = 1;

//     const eulerResult = eulerStep(state, dt);
//     const rk4Result = rk4Step(state, dt);

//     expect(rk4Result[1].x).not.toBeCloseTo(eulerResult[1].x, 5);
//     expect(rk4Result[1].y).not.toBeCloseTo(eulerResult[1].y, 5);
//   });

//   it('el paso RK4 debe seguir la fórmula y_{n+1} = y_n + (k1 + 2k2 + 2k3 + k4) * dt / 6', () => {
//     const state: BodyState[] = [
//       { name: 'Sol', x: 0, y: 0, vx: 0, vy: 0, mass: 1 },
//       { name: 'Tierra', x: 1, y: 0, vx: 0, vy: 0, mass: 3.003e-6 },
//     ];
//     const dt = 1;

//     const result = rk4Step(state, dt);

//     const r0to1 = Math.sqrt(1);
//     const k1_ax = G * 1 * (0 - 1) / (r0to1 ** 3);
//     const k1_ay = 0;

//     const k1_vx = 0;
//     const k1_vy = 0;

//     const midX = 1 + (k1_vx * dt) / 2;
//     const midY = 0 + (k1_vy * dt) / 2;
//     const midVx = 0 + (k1_ax * dt) / 2;
//     const midVy = 0 + (k1_ay * dt) / 2;

//     const dx2 = 0 - midX;
//     const dy2 = 0 - midY;
//     const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
//     const k2_ax = G * 1 * dx2 / (dist2 ** 3);
//     const k2_ay = G * 1 * dy2 / (dist2 ** 3);
//     const k2_vx = midVx;
//     const k2_vy = midVy;

//     const midX2 = 1 + (k2_vx * dt) / 2;
//     const midY2 = 0 + (k2_vy * dt) / 2;
//     const midVx2 = 0 + (k2_ax * dt) / 2;
//     const midVy2 = 0 + (k2_ay * dt) / 2;

//     const dx3 = 0 - midX2;
//     const dy3 = 0 - midY2;
//     const dist3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);
//     const k3_ax = G * 1 * dx3 / (dist3 ** 3);
//     const k3_ay = G * 1 * dy3 / (dist3 ** 3);
//     const k3_vx = midVx2;
//     const k3_vy = midVy2;

//     const endX = 1 + k3_vx * dt;
//     const endY = 0 + k3_vy * dt;
//     const endVx = 0 + k3_ax * dt;
//     const endVy = 0 + k3_ay * dt;

//     const dx4 = 0 - endX;
//     const dy4 = 0 - endY;
//     const dist4 = Math.sqrt(dx4 * dx4 + dy4 * dy4);
//     const k4_ax = G * 1 * dx4 / (dist4 ** 3);
//     const k4_ay = G * 1 * dy4 / (dist4 ** 3);

//     const expectedX = 1 + (k1_vx + 2 * k2_vx + 2 * k3_vx + endVx) * dt / 6;
//     const expectedY = 0 + (k1_vy + 2 * k2_vy + 2 * k3_vy + endVy) * dt / 6;
//     const expectedVx = 0 + (k1_ax + 2 * k2_ax + 2 * k3_ax + k4_ax) * dt / 6;
//     const expectedVy = 0 + (k1_ay + 2 * k2_ay + 2 * k3_ay + k4_ay) * dt / 6;

//     expect(result[1].x).toBeCloseTo(expectedX, 8);
//     expect(result[1].y).toBeCloseTo(expectedY, 8);
//     expect(result[1].vx).toBeCloseTo(expectedVx, 8);
//     expect(result[1].vy).toBeCloseTo(expectedVy, 8);
//   });
// });

// describe('rk4Step - estado completo 4N componentes', () => {
//   it('debe actualizar x, y, vx, vy para cada cuerpo (vector 4N)', () => {
//     const state: BodyState[] = [
//       { name: 'Sol', x: 0, y: 0, vx: 0, vy: 0, mass: 1 },
//       { name: 'Tierra', x: 1, y: 0, vx: 0, vy: Math.sqrt(G), mass: 3.003e-6 },
//       { name: 'Marte', x: 1.524, y: 0, vx: 0, vy: Math.sqrt(G / 1.524), mass: 3.213e-7 },
//     ];

//     const result = rk4Step(state, 1);

//     expect(result.length).toBe(3);

//     for (const body of result) {
//       expect(body.x).not.toBeNaN();
//       expect(body.y).not.toBeNaN();
//       expect(body.vx).not.toBeNaN();
//       expect(body.vy).not.toBeNaN();
//     }
//   });

//   it('cada cuerpo debe tener sus 4 componentes actualizados, no solo posición', () => {
//     const state: BodyState[] = [
//       { name: 'Sol', x: 0, y: 0, vx: 0, vy: 0, mass: 1 },
//       { name: 'Tierra', x: 1, y: 0, vx: 0, vy: Math.sqrt(G), mass: 3.003e-6 },
//     ];

//     const result = rk4Step(state, 1);

//     expect(result[1].vx).not.toBe(0);
//     expect(result[1].x).not.toBe(1);
//   });
// });

// describe('rk4Step - precisión superior a Euler', () => {
//   it('RK4 debe ser más preciso que Euler para la órbita terrestre', () => {
//     const vEarth = Math.sqrt(G / 1);
//     const initialState: BodyState[] = [
//       { name: 'Sol', x: 0, y: 0, vx: 0, vy: 0, mass: 1 },
//       { name: 'Tierra', x: 1, y: 0, vx: 0, vy: vEarth, mass: 3.003e-6 },
//     ];
//     const dt = 0.5;
//     const steps = 100;

//     let eulerState = initialState.map((b) => ({ ...b }));
//     let rk4State = initialState.map((b) => ({ ...b }));

//     for (let i = 0; i < steps; i++) {
//       eulerState = eulerStep(eulerState, dt);
//       rk4State = rk4Step(rk4State, dt);
//     }

//     const eulerDist = Math.sqrt(eulerState[1].x ** 2 + eulerState[1].y ** 2);
//     const rk4Dist = Math.sqrt(rk4State[1].x ** 2 + rk4State[1].y ** 2);

//     const eulerDistError = Math.abs(eulerDist - 1);
//     const rk4DistError = Math.abs(rk4Dist - 1);

//     expect(rk4DistError).toBeLessThan(eulerDistError);
//   });

//   it('RK4 debe conservar mejor la energía que Euler', () => {
//     const vEarth = Math.sqrt(G / 1);
//     const initialState: BodyState[] = [
//       { name: 'Sol', x: 0, y: 0, vx: 0, vy: 0, mass: 1 },
//       { name: 'Tierra', x: 1, y: 0, vx: 0, vy: vEarth, mass: 3.003e-6 },
//     ];

//     const kineticEnergy = (s: BodyState[]) =>
//       s.reduce((sum, b) => sum + 0.5 * b.mass * (b.vx ** 2 + b.vy ** 2), 0);
//     const potentialEnergy = (s: BodyState[]) => {
//       let pe = 0;
//       for (let i = 0; i < s.length; i++) {
//         for (let j = i + 1; j < s.length; j++) {
//           const dx = s[j].x - s[i].x;
//           const dy = s[j].y - s[i].y;
//           const dist = Math.sqrt(dx * dx + dy * dy);
//           pe -= (G * s[i].mass * s[j].mass) / dist;
//         }
//       }
//       return pe;
//     };
//     const totalEnergy = (s: BodyState[]) => kineticEnergy(s) + potentialEnergy(s);

//     const initialEnergy = totalEnergy(initialState);

//     let eulerState = initialState.map((b) => ({ ...b }));
//     let rk4State = initialState.map((b) => ({ ...b }));
//     const dt = 0.5;
//     const steps = 200;

//     for (let i = 0; i < steps; i++) {
//       eulerState = eulerStep(eulerState, dt);
//       rk4State = rk4Step(rk4State, dt);
//     }

//     const eulerEnergyError = Math.abs(totalEnergy(eulerState) - initialEnergy);
//     const rk4EnergyError = Math.abs(totalEnergy(rk4State) - initialEnergy);

//     expect(rk4EnergyError).toBeLessThan(eulerEnergyError);
//   });
// });

// describe('rk4Step - múltiples pasos consecutivos', () => {
//   it('debe poder ejecutar 730 pasos sin divergencia', () => {
//     const vEarth = Math.sqrt(G / 1);
//     let state: BodyState[] = [
//       { name: 'Sol', x: 0, y: 0, vx: 0, vy: 0, mass: 1 },
//       { name: 'Tierra', x: 1, y: 0, vx: 0, vy: vEarth, mass: 3.003e-6 },
//     ];
//     const dt = 0.5;
//     const steps = 730;

//     for (let i = 0; i < steps; i++) {
//       state = rk4Step(state, dt);
//     }

//     const distFromOrigin = Math.sqrt(state[1].x ** 2 + state[1].y ** 2);
//     expect(distFromOrigin).toBeGreaterThan(0.5);
//     expect(distFromOrigin).toBeLessThan(1.5);
//     expect(state[1].name).toBe('Tierra');
//     expect(isNaN(state[1].x)).toBe(false);
//     expect(isNaN(state[1].y)).toBe(false);
//   });

// it('k2 debe usar estado intermedio (no el inicial)', () => {
//   const state: BodyState[] = [
//     { name: 'Sol', x: 0, y: 0, vx: 0, vy: 0, mass: 1 },
//     { name: 'Tierra', x: 1, y: 0, vx: 0, vy: Math.sqrt(G), mass: 3.003e-6 },
//   ];

//   const result = rk4Step(state, 1);

//   const wrongK2 = rk4StepWithBug(state, 1); // Implementación hipotética con bug
//   expect(result[1].x).not.toBeCloseTo(wrongK2[1].x, 5);
// });
// });
