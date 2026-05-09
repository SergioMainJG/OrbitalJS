import { describe, it, expect } from "vitest";

describe(`euler-step.test.ts, testing para euler-step.ts!`, () => {
  it(`Hola Mundo es Hola mundo!`, () => {
    console.warn("No olvides descomentar el codigo y borrar el describe que funciona por ahora");
    console.info("Recuerda que puedes modificar este archivo a tu conveniencia");
    expect("Hello World").toBe("Hello World");
  });
});

// /* eslint-disable */
// /* prettier-ignore */
// import { describe, it, expect } from 'vitest';
// import { eulerStep } from '@/physics/euler-step';
// import type { BodyState } from '@/types';

// const G = (4 * Math.PI * Math.PI) / (365.25 * 365.25);

// describe('eulerStep - firma y tipo de retorno', () => {
//   it('debe aceptar (state: BodyState[], dt: number) y retornar BodyState[]', () => {
//     const state: BodyState[] = [
//       { name: 'test', x: 0, y: 0, vx: 1, vy: 0, mass: 1 },
//     ];

//     const result = eulerStep(state, 1);

//     expect(Array.isArray(result)).toBe(true);
//     expect(result.length).toBe(state.length);
//   });

//   it('debe retornar objetos con la estructura BodyState completa', () => {
//     const state: BodyState[] = [
//       { name: 'A', x: 1, y: 2, vx: 0.1, vy: 0.2, mass: 5 },
//     ];

//     const result = eulerStep(state, 0.5);

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

//     const result = eulerStep(state, 1);

//     expect(result[0].name).toBe('Sol');
//     expect(result[0].mass).toBe(1);
//     expect(result[1].name).toBe('Tierra');
//     expect(result[1].mass).toBeCloseTo(3.003e-6, 10);
//   });
// });

// describe('eulerStep - cuerpo sin interacción gravitacional', () => {
//   it('un solo cuerpo debe moverse en línea recta (aceleración = 0)', () => {
//     const state: BodyState[] = [
//       { name: 'partícula', x: 0, y: 0, vx: 2, vy: 3, mass: 1 },
//     ];
//     const dt = 0.5;

//     const result = eulerStep(state, dt);

//     expect(result[0].x).toBeCloseTo(0 + 2 * dt, 10);
//     expect(result[0].y).toBeCloseTo(0 + 3 * dt, 10);
//     expect(result[0].vx).toBeCloseTo(2, 10);
//     expect(result[0].vy).toBeCloseTo(3, 10);
//   });

//   it('dos cuerpos sin masa no deben generar aceleración entre ellos', () => {
//     const state: BodyState[] = [
//       { name: 'A', x: 0, y: 0, vx: 1, vy: 0, mass: 0 },
//       { name: 'B', x: 1, y: 0, vx: 0, vy: 1, mass: 0 },
//     ];
//     const dt = 1;

//     const result = eulerStep(state, dt);

//     expect(result[0].vx).toBeCloseTo(1, 10);
//     expect(result[0].vy).toBeCloseTo(0, 10);
//     expect(result[1].vx).toBeCloseTo(0, 10);
//     expect(result[1].vy).toBeCloseTo(1, 10);
//   });
// });

// describe('eulerStep - aceleración gravitacional N-cuerpos', () => {
//   it('debe calcular la aceleración de la Tierra hacia el Sol correctamente', () => {
//     const vEarth = Math.sqrt(G / 1);
//     const state: BodyState[] = [
//       { name: 'Sol', x: 0, y: 0, vx: 0, vy: 0, mass: 1 },
//       { name: 'Tierra', x: 1, y: 0, vx: 0, vy: vEarth, mass: 3.003e-6 },
//     ];
//     const dt = 1;

//     const result = eulerStep(state, dt);

//     const expectedAx = G * 1 * (0 - 1) / 1;
//     const expectedAy = G * 1 * (0 - 0) / 1;

//     expect(result[1].vx).toBeCloseTo(0 + expectedAx * dt, 8);
//     expect(result[1].vy).toBeCloseTo(vEarth + expectedAy * dt, 8);
//   });

//   it('debe calcular la aceleración del Sol hacia la Tierra (muy pequeña)', () => {
//     const vEarth = Math.sqrt(G / 1);
//     const state: BodyState[] = [
//       { name: 'Sol', x: 0, y: 0, vx: 0, vy: 0, mass: 1 },
//       { name: 'Tierra', x: 1, y: 0, vx: 0, vy: vEarth, mass: 3.003e-6 },
//     ];
//     const dt = 1;

//     const result = eulerStep(state, dt);

//     const expectedAxSun = G * 3.003e-6 * (1 - 0) / 1;

//     expect(result[0].vx).toBeCloseTo(expectedAxSun * dt, 15);
//   });

//   it('la aceleración debe seguir la fórmula a_i = G * Σ(m_j * (r_j - r_i) / |r_j - r_i|^3)', () => {
//     const state: BodyState[] = [
//       { name: 'A', x: 0, y: 0, vx: 0, vy: 0, mass: 10 },
//       { name: 'B', x: 3, y: 4, vx: 0, vy: 0, mass: 5 },
//     ];
//     const dt = 1;

//     const result = eulerStep(state, dt);

//     const dx = 3 - 0;
//     const dy = 4 - 0;
//     const dist = Math.sqrt(dx * dx + dy * dy);
//     const distCubed = dist * dist * dist;
//     const expectedAx = G * 5 * dx / distCubed;
//     const expectedAy = G * 5 * dy / distCubed;

//     expect(result[0].vx).toBeCloseTo(expectedAx * dt, 12);
//     expect(result[0].vy).toBeCloseTo(expectedAy * dt, 12);
//   });

//   it('debe funcionar con 3 cuerpos (aceleración suma de todas las interacciones)', () => {
//     const state: BodyState[] = [
//       { name: 'A', x: 0, y: 0, vx: 0, vy: 0, mass: 1 },
//       { name: 'B', x: 1, y: 0, vx: 0, vy: 0, mass: 1 },
//       { name: 'C', x: 0, y: 1, vx: 0, vy: 0, mass: 1 },
//     ];
//     const dt = 1;

//     const result = eulerStep(state, dt);

//     const axA_from_B = G * 1 * (1 - 0) / 1;
//     const ayA_from_B = 0;
//     const axA_from_C = 0;
//     const ayA_from_C = G * 1 * (1 - 0) / 1;

//     const expectedAx = axA_from_B + axA_from_C;
//     const expectedAy = ayA_from_B + ayA_from_C;

//     expect(result[0].vx).toBeCloseTo(expectedAx * dt, 12);
//     expect(result[0].vy).toBeCloseTo(expectedAy * dt, 12);
//   });
// });

// describe('eulerStep - regla de actualización', () => {
//   it('v_new = v + a*dt y r_new = r + v_new*dt (symplectic Euler)', () => {
//     const vEarth = Math.sqrt(G / 1);
//     const state: BodyState[] = [
//       { name: 'Sol', x: 0, y: 0, vx: 0, vy: 0, mass: 1 },
//       { name: 'Tierra', x: 1, y: 0, vx: 0, vy: vEarth, mass: 3.003e-6 },
//     ];
//     const dt = 1;

//     const result = eulerStep(state, dt);

//     const ax = G * 1 * (0 - 1) / 1;
//     const ay = G * 1 * (0 - 0) / 1;
//     const vxNew = 0 + ax * dt;
//     const vyNew = vEarth + ay * dt;

//     const expectedX = 1 + vxNew * dt;
//     const expectedY = 0 + vyNew * dt;

//     expect(result[1].x).toBeCloseTo(expectedX, 8);
//     expect(result[1].y).toBeCloseTo(expectedY, 8);
//     expect(result[1].vx).toBeCloseTo(vxNew, 8);
//     expect(result[1].vy).toBeCloseTo(vyNew, 8);
//   });

//   it('la posición debe actualizarse con la nueva velocidad, no con la vieja', () => {
//     const state: BodyState[] = [
//       { name: 'Sol', x: 0, y: 0, vx: 0, vy: 0, mass: 1 },
//       { name: 'Tierra', x: 1, y: 0, vx: 0, vy: 0, mass: 3.003e-6 },
//     ];
//     const dt = 1;

//     const result = eulerStep(state, dt);

//     const ax = G * 1 * (0 - 1) / 1;
//     const vxNew = 0 + ax * dt;

//     const posWithNewV = 1 + vxNew * dt;
//     const posWithOldV = 1 + 0 * dt;

//     expect(result[1].x).not.toBeCloseTo(posWithOldV, 5);
//     expect(result[1].x).toBeCloseTo(posWithNewV, 8);
//   });

//   it('debe funcionar correctamente con dt pequeño', () => {
//     const vEarth = Math.sqrt(G / 1);
//     const state: BodyState[] = [
//       { name: 'Sol', x: 0, y: 0, vx: 0, vy: 0, mass: 1 },
//       { name: 'Tierra', x: 1, y: 0, vx: 0, vy: vEarth, mass: 3.003e-6 },
//     ];
//     const dt = 0.5;

//     const result = eulerStep(state, dt);

//     const ax = G * 1 * (0 - 1) / 1;
//     const vxNew = 0 + ax * dt;
//     const vyNew = vEarth;

//     expect(result[1].x).toBeCloseTo(1 + vxNew * dt, 8);
//     expect(result[1].vx).toBeCloseTo(vxNew, 8);
//   });

//   it('debe poder ejecutar múltiples pasos consecutivos', () => {
//     const vEarth = Math.sqrt(G / 1);
//     let state: BodyState[] = [
//       { name: 'Sol', x: 0, y: 0, vx: 0, vy: 0, mass: 1 },
//       { name: 'Tierra', x: 1, y: 0, vx: 0, vy: vEarth, mass: 3.003e-6 },
//     ];
//     const dt = 1;
//     const steps = 10;

//     for (let i = 0; i < steps; i++) {
//       state = eulerStep(state, dt);
//     }

//     const distFromOrigin = Math.sqrt(state[1].x ** 2 + state[1].y ** 2);
//     expect(distFromOrigin).toBeGreaterThan(0.5);
//     expect(distFromOrigin).toBeLessThan(1.5);
//     expect(state.length).toBe(2);
//     expect(state[1].name).toBe('Tierra');
//   });

// it('debe manejar distancia cero sin NaN (protección contra división por cero)', () => {
//   const state: BodyState[] = [
//     { name: 'A', x: 0, y: 0, vx: 0, vy: 0, mass: 1 },
//     { name: 'B', x: 0, y: 0, vx: 0, vy: 0, mass: 1 }, // Misma posición
//   ];

//   const result = eulerStep(state, 0.1);

//   expect(isNaN(result[0].vx)).toBe(false);
//   expect(isNaN(result[1].vx)).toBe(false);
// });
// });
