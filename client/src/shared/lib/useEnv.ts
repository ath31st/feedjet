import { LAT, LOCATION_TITLE, LON } from '../config';

export function useEnv() {
  const lat = Number(LAT);
  const lon = Number(LON);

  return {
    locationTitle: LOCATION_TITLE ?? '',
    locationLat: Number.isNaN(lat) ? 0 : lat,
    locationLon: Number.isNaN(lon) ? 0 : lon,
  };
}
