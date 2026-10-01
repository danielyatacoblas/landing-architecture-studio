import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sunPosition, sunVector, compass } from '../lib/sun.ts';

const near = (a: number, b: number, tol = 0.6) => assert.ok(Math.abs(a - b) <= tol, `${a} ≠ ${b}`);

test('mediodía de equinoccio: el sol está al norte a 78° (90 − 12)', () => {
  const s = sunPosition(12, 'equinoccio');
  near(s.altitude, 77.95);
  near(s.azimuth, 0);
});

test('mediodía de verano en Lima: el sol pasa por el sur, casi cenital', () => {
  const s = sunPosition(12, 'verano');
  near(s.altitude, 78.61);
  near(s.azimuth, 180);
});

test('mediodía de invierno: sol bajo y al norte', () => {
  const s = sunPosition(12, 'invierno');
  near(s.altitude, 54.51);
  near(s.azimuth, 0);
});

test('en la mañana el sol está al este y en la tarde al oeste', () => {
  assert.equal(compass(sunPosition(8, 'equinoccio').azimuth), 'este');
  assert.equal(compass(sunPosition(16, 'equinoccio').azimuth), 'oeste');
});

test('el vector solar es unitario y apunta hacia arriba de día', () => {
  const s = sunPosition(10, 'invierno');
  const [x, y, z] = sunVector(s.altitude, s.azimuth);
  near(Math.hypot(x, y, z), 1, 1e-9);
  assert.ok(y > 0);
});
