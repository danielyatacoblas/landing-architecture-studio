// Posición del sol para Lima: altura y azimut a partir de la hora solar y la declinación.
export const LIMA_LAT = -12.05;

export type Season = 'verano' | 'equinoccio' | 'invierno';
export const DECLINATION: Record<Season, number> = { verano: -23.44, equinoccio: 0, invierno: 23.44 };
export const SEASON_LABEL: Record<Season, string> = { verano: '21 de diciembre', equinoccio: '21 de marzo', invierno: '21 de junio' };

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** altitude: grados sobre el horizonte; azimuth: grados desde el norte en sentido horario. */
export function sunPosition(hour: number, season: Season, lat = LIMA_LAT) {
  const H = rad(15 * (hour - 12));
  const d = rad(DECLINATION[season]);
  const phi = rad(lat);
  const sinAlt = Math.sin(phi) * Math.sin(d) + Math.cos(phi) * Math.cos(d) * Math.cos(H);
  const altitude = deg(Math.asin(sinAlt));
  const az = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(d) * Math.cos(phi));
  const azimuth = (deg(az) + 180 + 360) % 360;
  return { altitude, azimuth };
}

/** Vector unitario hacia el sol en coordenadas de la escena: x = este, y = arriba, z = sur. */
export function sunVector(altitude: number, azimuth: number): [number, number, number] {
  const a = rad(altitude), z = rad(azimuth);
  return [Math.cos(a) * Math.sin(z), Math.sin(a), -Math.cos(a) * Math.cos(z)];
}

export function compass(azimuth: number) {
  const names = ['norte', 'noreste', 'este', 'sureste', 'sur', 'suroeste', 'oeste', 'noroeste'];
  return names[Math.round(azimuth / 45) % 8];
}

export function formatHour(h: number) {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
