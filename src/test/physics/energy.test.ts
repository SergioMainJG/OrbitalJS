// /* eslint-disable */
// /* prettier-ignore */
import { describe, expect, it } from "vitest";

describe(`earth-orbit-validation.test.ts, testing para earth-orbit-valiation.ts!`, () => {
  it(`Hola Mundo es Hola mundo!`, () => {
    console.warn("No olvides descomentar el codigo y borrar el describe que funciona por ahora");
    console.info("Recuerda que puedes modificar este archivo a tu conveniencia");
    expect("Hello World").toBe("Hello World");
  });
});
// import { describe, expect, it } from 'vitest';
// import {
//   energyDrift,
//   getDriftStatus,
//   kineticEnergy,
//   potentialEnergy,
//   totalEnergy,
// } from '@/physics/energy';
// import { UNIVERSAL_CONSTS } from '@/constants/constants.config';
// import type { BodyState } from '@/types';

// const { G } = UNIVERSAL_CONSTS;

// const sunEarthSystem = (): BodyState[] => [
//   { name: 'Sun', mass: 1, x: 0, y: 0, vx: 0, vy: 0 },
//   { name: 'Earth', mass: 3e-6, x: 1, y: 0, vx: 0, vy: (2 * Math.PI) / 365.25 },
// ];

// describe('kineticEnergy', () => {
//   it('returns zero for an empty body list', () => {
//     expect(kineticEnergy([])).toBe(0);
//   });

//   it('returns zero for a body at rest', () => {
//     const bodies: BodyState[] = [{ name: 'A', mass: 1, x: 0, y: 0, vx: 0, vy: 0 }];
//     expect(kineticEnergy(bodies)).toBe(0);
//   });

//   it('computes half mv squared for a single body', () => {
//     const bodies: BodyState[] = [{ name: 'A', mass: 2, x: 0, y: 0, vx: 3, vy: 4 }];
//     expect(kineticEnergy(bodies)).toBe(25);
//   });

//   it('sums kinetic energy across all bodies', () => {
//     const bodies: BodyState[] = [
//       { name: 'A', mass: 1, x: 0, y: 0, vx: 2, vy: 0 },
//       { name: 'B', mass: 1, x: 5, y: 5, vx: 0, vy: 2 },
//     ];
//     expect(kineticEnergy(bodies)).toBe(4);
//   });

//   it('is always non-negative', () => {
//     const bodies: BodyState[] = [{ name: 'A', mass: 1, x: 0, y: 0, vx: -3, vy: -4 }];
//     expect(kineticEnergy(bodies)).toBeGreaterThanOrEqual(0);
//   });

//   it('uses vx and vy independently in the squared sum', () => {
//     const xOnly: BodyState[] = [{ name: 'A', mass: 1, x: 0, y: 0, vx: 2, vy: 0 }];
//     const yOnly: BodyState[] = [{ name: 'A', mass: 1, x: 0, y: 0, vx: 0, vy: 2 }];
//     expect(kineticEnergy(xOnly)).toBe(kineticEnergy(yOnly));
//   });
// });

// describe('potentialEnergy', () => {
//   it('returns zero for an empty body list', () => {
//     expect(potentialEnergy([])).toBe(0);
//   });

//   it('returns zero for a single body', () => {
//     const bodies: BodyState[] = [{ name: 'A', mass: 1e30, x: 0, y: 0, vx: 0, vy: 0 }];
//     expect(potentialEnergy(bodies)).toBe(0);
//   });

//   it('is negative for two attracting bodies', () => {
//     const bodies: BodyState[] = [
//       { name: 'A', mass: 1, x: 0, y: 0, vx: 0, vy: 0 },
//       { name: 'B', mass: 1, x: 1, y: 0, vx: 0, vy: 0 },
//     ];
//     expect(potentialEnergy(bodies)).toBeLessThan(0);
//   });

//   it('equals -G for two unit masses separated by 1 AU', () => {
//     const bodies: BodyState[] = [
//       { name: 'A', mass: 1, x: 0, y: 0, vx: 0, vy: 0 },
//       { name: 'B', mass: 1, x: 1, y: 0, vx: 0, vy: 0 },
//     ];
//     expect(potentialEnergy(bodies)).toBeCloseTo(-G, 10);
//   });

//   it('becomes less negative as bodies move farther apart', () => {
//     const close: BodyState[] = [
//       { name: 'A', mass: 1, x: 0, y: 0, vx: 0, vy: 0 },
//       { name: 'B', mass: 1, x: 1, y: 0, vx: 0, vy: 0 },
//     ];
//     const far: BodyState[] = [
//       { name: 'A', mass: 1, x: 0, y: 0, vx: 0, vy: 0 },
//       { name: 'B', mass: 1, x: 10, y: 0, vx: 0, vy: 0 },
//     ];
//     expect(potentialEnergy(close)).toBeLessThan(potentialEnergy(far));
//   });

//   it('counts each pair exactly once using i < j indexing', () => {
//     const bodies: BodyState[] = [
//       { name: 'A', mass: 1, x: 0, y: 0, vx: 0, vy: 0 },
//       { name: 'B', mass: 1, x: 1, y: 0, vx: 0, vy: 0 },
//     ];
//     expect(potentialEnergy(bodies)).toBeCloseTo(-G, 10);
//   });

//   it('scales with both masses', () => {
//     const light: BodyState[] = [
//       { name: 'A', mass: 1, x: 0, y: 0, vx: 0, vy: 0 },
//       { name: 'B', mass: 1, x: 1, y: 0, vx: 0, vy: 0 },
//     ];
//     const heavy: BodyState[] = [
//       { name: 'A', mass: 2, x: 0, y: 0, vx: 0, vy: 0 },
//       { name: 'B', mass: 2, x: 1, y: 0, vx: 0, vy: 0 },
//     ];
//     expect(potentialEnergy(heavy)).toBeCloseTo(potentialEnergy(light) * 4, 10);
//   });
// });

// describe('totalEnergy', () => {
//   it('returns zero for an empty body list', () => {
//     expect(totalEnergy([])).toBe(0);
//   });

//   it('equals kinetic plus potential energy', () => {
//     const bodies = sunEarthSystem();
//     expect(totalEnergy(bodies)).toBeCloseTo(kineticEnergy(bodies) + potentialEnergy(bodies), 15);
//   });

//   it('equals only kinetic energy when bodies are far apart', () => {
//     const bodies: BodyState[] = [
//       { name: 'A', mass: 1, x: 0, y: 0, vx: 1, vy: 0 },
//       { name: 'B', mass: 1, x: 1e9, y: 0, vx: 0, vy: 1 },
//     ];
//     const Etotal = totalEnergy(bodies);
//     const Ekin = kineticEnergy(bodies);
//     expect(Math.abs(Etotal - Ekin) / Math.abs(Ekin)).toBeLessThan(1e-5);
//   });
// });

// describe('energyDrift', () => {
//   it('returns zero when energy has not changed', () => {
//     expect(energyDrift(-10, -10)).toBe(0);
//   });

//   it('returns 1 when energy changes by 0.1 from an initial value of -10', () => {
//     expect(energyDrift(-10.1, -10)).toBeCloseTo(1, 5);
//   });

//   it('returns the same value regardless of the sign of the drift', () => {
//     expect(energyDrift(-9.9, -10)).toBeCloseTo(energyDrift(-10.1, -10), 10);
//   });

//   it('is always non-negative', () => {
//     expect(energyDrift(-15, -10)).toBeGreaterThanOrEqual(0);
//     expect(energyDrift(-5, -10)).toBeGreaterThanOrEqual(0);
//   });

//   it('returns 100 when energy doubles', () => {
//     expect(energyDrift(-20, -10)).toBeCloseTo(100, 10);
//   });
// });

// describe('getDriftStatus', () => {
//   it('returns green for zero drift', () => {
//     expect(getDriftStatus(0)).toBe('green');
//   });

//   it('returns green for drift below 0.1 percent', () => {
//     expect(getDriftStatus(0.05)).toBe('green');
//   });

//   it('returns yellow for drift of exactly 0.1 percent', () => {
//     expect(getDriftStatus(0.1)).toBe('yellow');
//   });

//   it('returns yellow for drift between 0.1 and 1 percent', () => {
//     expect(getDriftStatus(0.5)).toBe('yellow');
//   });

//   it('returns yellow for drift of exactly 1 percent', () => {
//     expect(getDriftStatus(1)).toBe('yellow');
//   });

//   it('returns red for drift above 1 percent', () => {
//     expect(getDriftStatus(2)).toBe('red');
//   });

//   it('returns red for drift of 1.01 percent', () => {
//     expect(getDriftStatus(1.01)).toBe('red');
//   });

//   it('covers all three threshold levels with distinct values', () => {
//     const statuses = new Set([getDriftStatus(0.05), getDriftStatus(0.5), getDriftStatus(2)]);
//     expect(statuses.size).toBe(3);
//   });
// });
