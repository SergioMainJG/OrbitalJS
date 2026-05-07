import { describe, it, expect } from 'vitest';

describe(`jpl-horizons.test.ts, testing para jpl-horizons.ts!`, () => {
  it(`Hola Mundo es Hola mundo!`, () => {
    console.warn("No olvides descomentar el codigo y borrar el describe que funciona por ahora");
    console.info("Recuerda que puedes modificar este archivo a tu conveniencia");
    expect("Hello World").toBe("Hello World");
  });
});

/* eslint-disable */
/* prettier-ignore */
// import { describe, it, expect, vi, beforeEach } from 'vitest';
// import { fetchJPLHorizons, parseJPLResponse } from '@/physics/jpl-horizons';
// import type { BodyState } from '@/types';

// const MOCK_JPL_RESPONSE = `
// Ephemeris / WWW_USER Wed Jan  1 00:00:00 2000 Pasadena, USA / 34.1478N 118.1441W

// SOE
// 2451544.5 = A.D. 2000-Jan-01 00:00:00.0000 TDB
//  X = 1.756983452435614E-01 Y = 9.659026434986397E-01 Z = 1.826482501463689E-04
//  VX=-1.674402467902025E-02 VY= 3.049202010532834E-03 VZ= 3.329406900748449E-07
// 2451545.5 = A.D. 2000-Jan-02 00:00:00.0000 TDB
//  X = 1.583232431647069E-01 Y = 9.689182990500478E-01 Z = 1.739548648239894E-04
//  VX=-1.676050876495526E-02 VY= 2.736575930025969E-03 VZ= 3.265261813858644E-07
// EOD
// `;

// const MOCK_JPL_SINGLE_EPOCH = `
// SOE
// 2451544.5 = A.D. 2000-Jan-01 00:00:00.0000 TDB
//  X = 1.756983452435614E-01 Y = 9.659026434986397E-01 Z = 1.826482501463689E-04
//  VX=-1.674402467902025E-02 VY= 3.049202010532834E-03 VZ= 3.329406900748449E-07
// EOD
// `;

// const MOCK_JPL_NO_DATA = `
// No ephemeris data available.
// `;

// describe('fetchJPLHorizons', () => {
//   beforeEach(() => {
//     vi.restoreAllMocks();
//   });

//   it('debe llamar a la API de JPL Horizons con el bodyId correcto', async () => {
//     const mockFetch = vi.fn().mockResolvedValue({
//       ok: true,
//       text: () => Promise.resolve(MOCK_JPL_RESPONSE),
//     });
//     vi.stubGlobal('fetch', mockFetch);

//     await fetchJPLHorizons('399', { startTime: '2000-01-01', stopTime: '2000-01-02', stepSize: '1 d' });

//     expect(mockFetch).toHaveBeenCalledOnce();
//     const calledUrl = mockFetch.mock.calls[0][0] as string;
//     expect(calledUrl).toContain('ssd.jpl.nasa.gov');
//     expect(calledUrl).toContain('399');
//   });

//   it('debe incluir COMMAND con el bodyId en la URL', async () => {
//     const mockFetch = vi.fn().mockResolvedValue({
//       ok: true,
//       text: () => Promise.resolve(MOCK_JPL_RESPONSE),
//     });
//     vi.stubGlobal('fetch', mockFetch);

//     await fetchJPLHorizons('399');

//     const calledUrl = mockFetch.mock.calls[0][0] as string;
//     expect(calledUrl).toMatch(/COMMAND.*399/i);
//   });

//   it('debe incluir EPHEM_TYPE=VECTORS en la URL', async () => {
//     const mockFetch = vi.fn().mockResolvedValue({
//       ok: true,
//       text: () => Promise.resolve(MOCK_JPL_RESPONSE),
//     });
//     vi.stubGlobal('fetch', mockFetch);

//     await fetchJPLHorizons('399');

//     const calledUrl = mockFetch.mock.calls[0][0] as string;
//     expect(calledUrl).toMatch(/EPHEM_TYPE.*VECTORS/i);
//   });

//   it('debe retornar el texto crudo de la respuesta', async () => {
//     vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
//       ok: true,
//       text: () => Promise.resolve(MOCK_JPL_RESPONSE),
//     }));

//     const result = await fetchJPLHorizons('399');

//     expect(typeof result).toBe('string');
//     expect(result).toContain('SOE');
//     expect(result).toContain('EOD');
//   });

//   it('debe lanzar error cuando la respuesta no es ok', async () => {
//     vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
//       ok: false,
//       status: 400,
//       statusText: 'Bad Request',
//     }));

//     await expect(fetchJPLHorizons('399')).rejects.toThrow();
//   });

//   it('debe pasar las opciones de tiempo a la URL', async () => {
//     const mockFetch = vi.fn().mockResolvedValue({
//       ok: true,
//       text: () => Promise.resolve(MOCK_JPL_RESPONSE),
//     });
//     vi.stubGlobal('fetch', mockFetch);

//     await fetchJPLHorizons('399', {
//       startTime: '2000-01-01',
//       stopTime: '2000-12-31',
//       stepSize: '30 d',
//     });

//     const calledUrl = mockFetch.mock.calls[0][0] as string;
//     expect(calledUrl).toContain('2000-01-01');
//     expect(calledUrl).toContain('2000-12-31');
//     expect(calledUrl).toContain('30');
//   });
// });

// describe('parseJPLResponse', () => {
//   it('debe extraer vectores de posición y velocidad de la respuesta', () => {
//     const result = parseJPLResponse(MOCK_JPL_RESPONSE);

//     expect(result.length).toBeGreaterThanOrEqual(1);
//   });

//   it('debe retornar objetos con la estructura BodyState', () => {
//     const result = parseJPLResponse(MOCK_JPL_RESPONSE);

//     for (const body of result) {
//       expect(body).toHaveProperty('name');
//       expect(body).toHaveProperty('x');
//       expect(body).toHaveProperty('y');
//       expect(body).toHaveProperty('vx');
//       expect(body).toHaveProperty('vy');
//       expect(body).toHaveProperty('mass');
//       expect(typeof body.x).toBe('number');
//       expect(typeof body.y).toBe('number');
//       expect(typeof body.vx).toBe('number');
//       expect(typeof body.vy).toBe('number');
//     }
//   });

//   it('debe parsear correctamente los valores numéricos de X, Y, VX, VY', () => {
//     const result = parseJPLResponse(MOCK_JPL_SINGLE_EPOCH);

//     expect(result.length).toBe(1);
//     const body = result[0];
//     expect(body.x).toBeCloseTo(1.756983452435614e-1, 10);
//     expect(body.y).toBeCloseTo(9.659026434986397e-1, 10);
//     expect(body.vx).toBeCloseTo(-1.674402467902025e-2, 10);
//     expect(body.vy).toBeCloseTo(3.049202010532834e-3, 10);
//   });

//   it('debe manejar múltiples épocas en la respuesta', () => {
//     const result = parseJPLResponse(MOCK_JPL_RESPONSE);

//     expect(result.length).toBe(2);
//     expect(result[0].x).not.toBeCloseTo(result[1].x, 5);
//     expect(result[0].y).not.toBeCloseTo(result[1].y, 5);
//   });

//   it('debe retornar arreglo vacío cuando no hay datos SOE/EOD', () => {
//     const result = parseJPLResponse(MOCK_JPL_NO_DATA);

//     expect(result).toEqual([]);
//   });

//   it('debe retornar arreglo vacío para texto vacío', () => {
//     const result = parseJPLResponse('');

//     expect(result).toEqual([]);
//   });

//   it('debe ignorar la componente Z y usar solo X, Y para posición', () => {
//     const result = parseJPLResponse(MOCK_JPL_SINGLE_EPOCH);

//     expect(result.length).toBe(1);
//     const body = result[0];
//     expect(Object.keys(body)).not.toContain('z');
//     expect(Object.keys(body)).not.toContain('vz');
//   });

//   it('debe manejar valores negativos en componentes de velocidad', () => {
//     const result = parseJPLResponse(MOCK_JPL_SINGLE_EPOCH);

//     expect(result[0].vx).toBeLessThan(0);
//   });

//   it('debe manejar el formato compacto sin espacios después del signo igual', () => {
//     const compactResponse = `
// SOE
// 2451544.5 = A.D. 2000-Jan-01 00:00:00.0000 TDB
//  X=1.756983452435614E-01 Y=9.659026434986397E-01 Z=1.826482501463689E-04
//  VX=-1.674402467902025E-02 VY=3.049202010532834E-03 VZ=3.329406900748449E-07
// EOD
// `;
//     const result = parseJPLResponse(compactResponse);

//     expect(result.length).toBe(1);
//     expect(result[0].x).toBeCloseTo(1.756983452435614e-1, 10);
//     expect(result[0].vx).toBeCloseTo(-1.674402467902025e-2, 10);
//   });
// });

// describe('fetchJPLHorizons + parseJPLResponse integración', () => {
//   beforeEach(() => {
//     vi.restoreAllMocks();
//   });

//   it('debe obtener y parsear datos para obtener un BodyState válido', async () => {
//     vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
//       ok: true,
//       text: () => Promise.resolve(MOCK_JPL_SINGLE_EPOCH),
//     }));

//     const raw = await fetchJPLHorizons('399');
//     const result = parseJPLResponse(raw);

//     expect(result.length).toBe(1);
//     expect(result[0]).toMatchObject({
//       name: expect.any(String),
//       x: expect.any(Number),
//       y: expect.any(Number),
//       vx: expect.any(Number),
//       vy: expect.any(Number),
//       mass: expect.any(Number),
//     });
//   });
// });
