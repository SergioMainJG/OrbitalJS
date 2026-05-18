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
// import { auToPixels } from '@/render/scale';

// describe('auToPixels', () => {
//   it('maps 0 AU to 0 pixels relative to canvas center', () => {
//     expect(auToPixels(0, 800, 4)).toBe(0);
//   });

//   it('maps the full viewRange to the full canvas width', () => {
//     expect(auToPixels(4, 800, 4)).toBe(800);
//   });

//   it('maps half the viewRange to the canvas half-width', () => {
//     expect(auToPixels(2, 800, 4)).toBe(400);
//   });

//   it('maps a negative AU offset to a negative pixel offset', () => {
//     expect(auToPixels(-2, 800, 4)).toBe(-400);
//   });

//   it('scales linearly with AU distance', () => {
//     expect(auToPixels(1, 800, 4)).toBe(200);
//   });

//   it('scales proportionally when canvas size doubles', () => {
//     const small = auToPixels(1, 400, 4);
//     const large = auToPixels(1, 800, 4);
//     expect(large).toBe(small * 2);
//   });

//   it('scales inversely when viewRange doubles', () => {
//     const narrow = auToPixels(1, 800, 4);
//     const wide = auToPixels(1, 800, 8);
//     expect(wide).toBe(narrow / 2);
//   });

//   it('returns a symmetric result for equal positive and negative distances', () => {
//     expect(auToPixels(1.5, 800, 4)).toBe(-auToPixels(-1.5, 800, 4));
//   });

//   it('produces the same scale for a square canvas', () => {
//     expect(auToPixels(1, 600, 6)).toBeCloseTo(100);
//   });
// });
